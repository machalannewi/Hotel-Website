import pool from "../config/db.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const searchRoomAvailabilty = async (checkIn, checkOut) => {
  // Get available rooms from database
  const query = `
    SELECT * FROM rooms
    WHERE room_id NOT IN (
        SELECT room_id FROM reservations
        WHERE (check_in <= $2 AND check_out > $1)
    )
  `;
  const { rows } = await pool.query(query, [checkIn, checkOut]);
  
  // Load room data from JSON file
  const roomDataPath = path.join(__dirname, '../../Hotel Website/src/lib/allRooms.json');
  const allRoomsData = JSON.parse(fs.readFileSync(roomDataPath, 'utf8'));
  
  // Merge database results with JSON data (images, amenities, etc.)
  const roomsWithCompleteData = rows.map(room => {
    const jsonRoomData = allRoomsData.find(r => r.id === room.room_id);
    
    if (jsonRoomData) {
      return {
        ...room,
        // Add image and other data from JSON
        image: jsonRoomData.image,
        name: jsonRoomData.name,
        size: jsonRoomData.size,
        beds: jsonRoomData.beds,
        description: jsonRoomData.description,
        amenities: jsonRoomData.amenities,
        // Keep database fields like price if they're more up-to-date
        price: room.price || jsonRoomData.price
      };
    }
    
    // Return room without additional data if not found in JSON
    return room;
  });
  
  return roomsWithCompleteData;
};

export default searchRoomAvailabilty;