import express from "express";
import createBooking from "../controllers/bookings.js";

const router = express.Router();

router.post('/input', createBooking);

export default router;