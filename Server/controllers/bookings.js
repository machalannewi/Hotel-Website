import inputAvailableRoom from "../models/bookings.js"

const createBooking = async (req, res) => {
    try {
        const {
        roomId,
        checkIn,
        checkOut,
        email,
        phone,
        fullName,
        guests,
        promoCode
       } = req.query;

        if (!roomId || !checkIn || !checkOut || !email || !phone || !fullName || !guests || !promoCode) {
           return res.status(400).json({ error: "Missing required parameters" });
        }

        const isBooked = await inputAvailableRoom(
            roomId,
            checkIn,
            checkOut,
            email,
            phone,
            fullName,
            guests,
            promoCode
      )

      res.json({
        booked: isBooked
      })
    } catch(error) {
        console.error(error, "Error Inserting Booking");
        res.status(500).json({ error: "Database error" });
    }
}

export default createBooking;