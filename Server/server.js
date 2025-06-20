import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios";
import crypto from "crypto";
import roomsRouter from "./routes/rooms.js";
import bookingRouter from "./routes/bookings.js";
import pool from "./config/db.js";


dotenv.config();

const app = express();
const port = 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: "https://the-monarch-sepia.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.error("PAYSTACK_SECRET_KEY is required");
  process.exit(1);
}



app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingRouter);

const paystackAPI = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
});


app.post("/api/payments/initialize", async (req, res) => {
  try {
    console.log("Request body received:", req.body);
    

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is empty or invalid",
        received: req.body
      });
    }

    const {
      email,
      amount,
      currency = "NGN",
      reference,
      callback_url,
      metadata,
    } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        error: "Email and amount are required",
        received: { email, amount }
      });
    }

    const paymentReference =
      reference ||
      `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const paymentData = {
      email,
      amount: Math.round(amount * 100),
      currency,
      reference: paymentReference,
      callback_url:
        callback_url ||
        `${process.env.FRONTEND_URL}/payment-callback`,
      metadata: {
        ...metadata,
        cancel_action: `${process.env.FRONTEND_URL}/payment-callback?status=cancelled&reference=${paymentReference}`,
      },
    };

    console.log("Sending to Paystack:", paymentData);

    const response = await paystackAPI.post(
      "/transaction/initialize",
      paymentData
    );

    if (response.data.status) {
      await pool.query(
        `INSERT INTO payment_logs (reference, email, amount, currency, status, metadata, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          paymentReference,
          email,
          amount,
          currency,
          "initialized",
          JSON.stringify(metadata),
          new Date().toISOString(),
        ]
      );

      res.json(response.data);
    } else {
      throw new Error("Failed to initialize payment with Paystack");
    }
  } catch (error) {
    console.error("Error initializing payment:", error);
    res.status(500).json({
      error: "Failed to initialize payment",
      details: error.response?.data?.message || error.message,
    });
  }
});

// Verify Paystack payment
app.get("/api/payments/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await paystackAPI.get(
      `/transaction/verify/${reference}`
    );

    if (
      response.data.status &&
      response.data.data.status === "success"
    ) {
      await pool.query(
        `UPDATE payment_logs SET status = $1, verified_at = $2, gateway_response = $3 WHERE reference = $4`,
        [
          "success",
          new Date().toISOString(),
          JSON.stringify(response.data.data),
          reference,
        ]
      );

      const metadata = response.data.data.metadata;
      if (metadata?.booking_id) {
        await pool.query(
          `UPDATE bookings SET status = $1, payment_reference = $2, confirmed_at = $3 WHERE id = $4`,
          [
            "confirmed",
            reference,
            new Date().toISOString(),
            metadata.booking_id,
          ]
        );
      }

      res.json({
        status: "success",
        message: "Payment verified successfully",
        data: response.data.data,
      });
    } else {
      await pool.query(
        `UPDATE payment_logs SET status = $1, verified_at = $2, gateway_response = $3 WHERE reference = $4`,
        [
          "failed",
          new Date().toISOString(),
          JSON.stringify(response.data.data),
          reference,
        ]
      );

      res.json({
        status: "failed",
        message: "Payment verification failed",
        data: response.data.data,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      error: "Failed to verify payment",
      details: error.response?.data?.message || error.message,
    });
  }
});

// Webhook handler
app.post("/api/webhooks/paystack", (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash === req.headers["x-paystack-signature"]) {
      const event = req.body;

      switch (event.event) {
        case "charge.success":
          handleSuccessfulPayment(event.data);
          break;
        case "charge.failed":
          handleFailedPayment(event.data);
          break;
        default:
          console.log("Unhandled webhook event:", event.event);
      }

      res.sendStatus(200);
    } else {
      console.error("Invalid webhook signature");
      res.sendStatus(400);
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
});

// Successful payment handler
async function handleSuccessfulPayment(data) {
  try {
    const { reference, metadata } = data;

    await pool.query(
      `UPDATE payment_logs SET status = $1, webhook_received_at = $2, gateway_response = $3 WHERE reference = $4`,
      [
        "success",
        new Date().toISOString(),
        JSON.stringify(data),
        reference,
      ]
    );

    if (metadata?.booking_id) {
      await pool.query(
        `UPDATE bookings SET status = $1, payment_reference = $2, confirmed_at = $3 WHERE id = $4`,
        [
          "confirmed",
          reference,
          new Date().toISOString(),
          metadata.booking_id,
        ]
      );
    }

    console.log(`Payment successful for reference: ${reference}`);
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

// Failed payment handler
async function handleFailedPayment(data) {
  try {
    const { reference } = data;

    await pool.query(
      `UPDATE payment_logs SET status = $1, webhook_received_at = $2, gateway_response = $3 WHERE reference = $4`,
      [
        "failed",
        new Date().toISOString(),
        JSON.stringify(data),
        reference,
      ]
    );

    console.log(`Payment failed for reference: ${reference}`);
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

// Get payment status
app.get("/api/payments/status/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM payment_logs WHERE reference = $1 LIMIT 1`,
      [reference]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({ error: "Failed to fetch payment status" });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});