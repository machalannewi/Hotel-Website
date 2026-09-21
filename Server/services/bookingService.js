import axios from "axios";
import pool from "../config/db.js";
import { sendBookingConfirmationEmail } from "./emailService.js";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const paystackAPI = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const REQUIRED_METADATA_FIELDS = [
  "roomId",
  "checkIn",
  "checkOut",
  "email",
  "phone",
  "fullName",
  "guests",
  "totalPrice",
  "roomName",
];

/**
 * Verifies a Paystack payment reference and, if it represents a genuine
 * successful payment that hasn't already been turned into a booking,
 * creates the reservation. Idempotent: safe to call more than once for the
 * same reference (e.g. once from the client callback, once from the
 * webhook) — only the first call creates a booking/sends an email.
 */
export const verifyAndCreateBooking = async (reference) => {
  if (!reference) {
    return { success: false, reason: "missing_reference" };
  }

  // Reservations already carrying this reference means we've already
  // booked it — return early without hitting Paystack again.
  const existing = await pool.query(
    `SELECT * FROM reservations WHERE reference = $1`,
    [reference]
  );
  if (existing.rows.length > 0) {
    return { success: true, alreadyBooked: true, booking: existing.rows[0] };
  }

  let verifyResponse;
  try {
    verifyResponse = await paystackAPI.get(`/transaction/verify/${reference}`);
  } catch (error) {
    if (error.response?.status === 400 || error.response?.data?.code === "transaction_not_found") {
      return { success: false, reason: "reference_not_found" };
    }
    throw error;
  }
  const transaction = verifyResponse.data?.data;

  if (!verifyResponse.data?.status || transaction?.status !== "success") {
    return { success: false, reason: "payment_not_successful" };
  }

  const metadata = transaction.metadata || {};
  const missingField = REQUIRED_METADATA_FIELDS.find((field) => !metadata[field] && metadata[field] !== 0);
  if (missingField) {
    return { success: false, reason: "incomplete_metadata", missingField };
  }

  // The amount actually charged (Paystack-confirmed, can't be tampered
  // with after the fact) must match what we ourselves computed and asked
  // Paystack to charge when this reference was created — logged in
  // payment_logs at initialize time, never derived from client input.
  const { rows: logRows } = await pool.query(
    `SELECT amount FROM payment_logs WHERE reference = $1`,
    [reference]
  );
  const expectedAmountKobo = logRows[0] ? Math.round(Number(logRows[0].amount) * 100) : null;

  if (expectedAmountKobo == null || transaction.amount !== expectedAmountKobo) {
    return { success: false, reason: "amount_mismatch" };
  }

  const {
    roomId,
    checkIn,
    checkOut,
    email,
    phone,
    fullName,
    guests,
    promoCode,
    totalPrice,
    roomName,
  } = metadata;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock any reservations for this room that could overlap the requested
    // dates for the duration of this transaction, so a concurrent booking
    // for the same room can't slip in between our check and our insert.
    await client.query(
      `SELECT id FROM reservations WHERE room_id = $1 FOR UPDATE`,
      [roomId]
    );

    const overlap = await client.query(
      `SELECT id FROM reservations
       WHERE room_id = $1 AND check_in < $3 AND check_out > $2`,
      [roomId, checkIn, checkOut]
    );

    if (overlap.rows.length > 0) {
      await client.query("ROLLBACK");
      return { success: false, reason: "room_no_longer_available" };
    }

    // Re-check for the reference under the lock in case of a genuine
    // concurrent call (client callback + webhook firing at the same time).
    const dupe = await client.query(
      `SELECT * FROM reservations WHERE reference = $1`,
      [reference]
    );
    if (dupe.rows.length > 0) {
      await client.query("ROLLBACK");
      return { success: true, alreadyBooked: true, booking: dupe.rows[0] };
    }

    const insertResult = await client.query(
      `INSERT INTO reservations
         (room_id, check_in, check_out, email, phone, full_name, guest, promo_code, total_price, room_name, reference, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP)
       RETURNING *`,
      [roomId, checkIn, checkOut, email, phone, fullName, guests, promoCode || null, totalPrice, roomName, reference]
    );

    await client.query("COMMIT");

    const booking = insertResult.rows[0];

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const emailResult = await sendBookingConfirmationEmail({
      fullName,
      email,
      roomName,
      checkIn,
      checkOut,
      guests,
      totalPrice: parseFloat(totalPrice),
      nights,
      paymentReference: reference,
    });

    if (!emailResult.success) {
      console.error("Failed to send confirmation email:", emailResult.error);
    }

    return { success: true, alreadyBooked: false, booking, emailSent: emailResult.success };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
