import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios";
import crypto from "crypto";
import roomsRouter from "./routes/rooms.js";
import bookingRouter from "./routes/bookings.js";
import searchRoomRouter from "./routes/searchRoom.js";
import pool from "./config/db.js";
import { verifyAndCreateBooking } from "./services/bookingService.js";
import { computeBookingPrice, getRoomName } from "./services/pricingService.js";


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
  next();
});

app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/search-rooms', searchRoomRouter);


const paystackAPI = axios.create({
    baseURL: "https://api.paystack.co",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
});


app.post("/api/payments/initialize", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Request body is empty or invalid",
        received: req.body
      });
    }

    const {
      email,
      phone,
      fullName,
      guests,
      promoCode,
      roomId,
      checkIn,
      checkOut,
      callback_url,
    } = req.body;

    if (!email || !phone || !fullName || !guests || !roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        error: "Missing required booking details",
        received: { email, phone, fullName, guests, roomId, checkIn, checkOut }
      });
    }

    // The price is computed here, from the room's known price and a
    // server-fetched exchange rate — never from anything the client sends.
    // This is what actually gets charged, so it can't be tampered with by
    // altering the request.
    const pricing = await computeBookingPrice(roomId, checkIn, checkOut);
    if (!pricing) {
      return res.status(400).json({ error: "Unknown room or invalid dates" });
    }

    const roomName = await getRoomName(roomId);
    if (!roomName) {
      return res.status(400).json({ error: "Unknown room" });
    }

    const paymentReference = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const metadata = {
      roomId,
      checkIn,
      checkOut,
      email,
      phone,
      fullName,
      guests,
      promoCode: promoCode || null,
      roomName,
      totalPrice: pricing.totalPriceUsd,
      nights: pricing.nights,
      exchangeRate: pricing.rate,
    };

    const paymentData = {
      email,
      amount: pricing.amountKobo,
      currency: "NGN",
      reference: paymentReference,
      callback_url:
        callback_url ||
        `${process.env.FRONTEND_URL}/payment-callback`,
      metadata: {
        ...metadata,
        cancel_action: `${process.env.FRONTEND_URL}/payment-callback?status=cancelled&reference=${paymentReference}`,
      },
    };

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
          pricing.amountKobo / 100,
          "NGN",
          "initialized",
          JSON.stringify(paymentData.metadata),
          new Date().toISOString(),
        ]
      );

      res.json({ ...response.data, pricing: { totalPriceUsd: pricing.totalPriceUsd, totalPriceNgn: pricing.totalPriceNgn, nights: pricing.nights } });
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

// Webhook handler.
// This is the authoritative path for turning a payment into a booking:
// the client-driven callback (PaymentCallback.jsx -> POST /api/bookings/input)
// covers the common case where the user's browser makes it back to the
// site, but the webhook is what guarantees a booking still gets created
// (and the room still gets locked) even if the user closes the tab right
// after paying. Both paths call the same idempotent verifyAndCreateBooking,
// so whichever fires first wins and the other is a no-op.
const handleSuccessfulPayment = async (data) => {
  try {
    await pool.query(
      `UPDATE payment_logs SET status = $1, webhook_received_at = $2, gateway_response = $3 WHERE reference = $4`,
      ["success", new Date().toISOString(), JSON.stringify(data), data.reference]
    );

    const result = await verifyAndCreateBooking(data.reference);
    if (!result.success) {
      console.error(`Webhook could not create booking for ${data.reference}:`, result.reason);
    }
  } catch (error) {
    console.error("Error handling successful payment webhook:", error);
  }
};

const handleFailedPayment = async (data) => {
  try {
    await pool.query(
      `UPDATE payment_logs SET status = $1, webhook_received_at = $2, gateway_response = $3 WHERE reference = $4`,
      ["failed", new Date().toISOString(), JSON.stringify(data), data.reference]
    );
  } catch (error) {
    console.error("Error handling failed payment webhook:", error);
  }
};

app.post("/api/webhooks/paystack", (req, res) => {
  try {
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash === req.headers["x-paystack-signature"]) {
      const event = req.body;

      // Acknowledge immediately so Paystack doesn't retry while we work;
      // the handlers themselves are idempotent so a retry is harmless
      // anyway, but there's no need to make Paystack wait on the DB/email work.
      res.sendStatus(200);

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
    } else {
      console.error("Invalid webhook signature");
      res.sendStatus(400);
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});