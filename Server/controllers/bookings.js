import inputAvailableRoom from "../models/bookings.js";
import { sendBookingConfirmationEmail } from "../services/emailService.js";


const createBooking = async (req, res) => {
    try {
      console.log('Received booking request:', req.query);
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
            roomName
        } = req.query;
        
        if (!roomId || !checkIn || !checkOut || !email || !phone || !fullName || !guests || !totalPrice || !roomName) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        console.log('Validation passed, creating booking...');
        // Create the booking
        const isBooked = await inputAvailableRoom (
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
        );

        
        if (isBooked) {

          console.log('Booking successful, preparing email...');
            // Calculate nights
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
          
            
            // Prepare booking details for email
            const bookingDetails = {
                fullName,
                email,
                roomName,
                checkIn,
                checkOut,
                guests,
                totalPrice: parseFloat(totalPrice),
                nights
            };
            
            // Send confirmation email
            const emailResult = await sendBookingConfirmationEmail(bookingDetails);
            
            if (!emailResult.success) {
                console.error('Failed to send confirmation email:', emailResult.error);
                // Still return success for booking, but log email failure
            }
            
            res.json({
                booked: isBooked,
                emailSent: emailResult.success,
                message: emailResult.success 
                    ? "Booking confirmed and confirmation email sent!" 
                    : "Booking confirmed but email failed to send. Please contact support."
            });
        } else {
            res.json({
                booked: false,
                message: "Booking failed"
            });
        }
        
    } catch(error) {
        console.error(error, "Error Inserting Booking");
        res.status(500).json({ error: "Database error" });
    }
};

export default createBooking;