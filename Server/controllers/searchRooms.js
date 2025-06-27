import searchRoomAvailabilty from "../models/searchRoom.js";

const searchAvailableRoom = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
   
    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    
    const availableRooms = await searchRoomAvailabilty(checkIn, checkOut);
    const isAvailable = availableRooms.length > 0;
   
    res.json({
      available: isAvailable,
      message: isAvailable
        ? "Here are the Rooms available!"
        : "All Rooms are booked for selected dates",
      rooms: availableRooms // Return the actual available rooms
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export default searchAvailableRoom;