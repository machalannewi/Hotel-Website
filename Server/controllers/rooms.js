import checkAvailability from "../models/Room.js";

const verifyRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;
    

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const isAvailable = await checkAvailability(roomId, checkIn, checkOut);
    
    res.json({
      available: isAvailable,
      message: isAvailable 
        ? "Room is available!" 
        : "Room is booked for selected dates"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export default verifyRoomAvailability;