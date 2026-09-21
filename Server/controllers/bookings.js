import { verifyAndCreateBooking } from "../services/bookingService.js";

const createBooking = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ error: "Payment reference is required" });
    }

    const result = await verifyAndCreateBooking(reference);

    if (result.success) {
      return res.json({
        booked: true,
        alreadyBooked: !!result.alreadyBooked,
        emailSent: result.emailSent,
        booking: result.booking,
        message: result.alreadyBooked
          ? "Booking already confirmed for this payment."
          : "Booking confirmed and confirmation email sent!",
      });
    }

    const statusByReason = {
      payment_not_successful: 402,
      amount_mismatch: 402,
      incomplete_metadata: 400,
      room_no_longer_available: 409,
      missing_reference: 400,
      reference_not_found: 404,
    };

    return res.status(statusByReason[result.reason] || 400).json({
      booked: false,
      reason: result.reason,
      message:
        result.reason === "room_no_longer_available"
          ? "Your payment succeeded, but this room was just booked for those dates by someone else. Please contact support with your payment reference for a refund."
          : "We couldn't confirm this booking.",
    });
  } catch (error) {
    console.error(error, "Error creating booking");
    res.status(500).json({ error: "Server error" });
  }
};

export default createBooking;
