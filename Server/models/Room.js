import pool from "../config/db.js";

const checkAvailability = async (roomId, checkIn, checkOut) => {
  const query = `
    SELECT * FROM reservations 
    WHERE room_id = $1 
    AND (
      (check_in <= $3 AND check_out >= $2) 
      OR 
      (check_in BETWEEN $2 AND $3)
    )
  `;
  const { rows } = await pool.query(query, [roomId, checkIn, checkOut]);
  return rows.length === 0; // True if available
};

export default checkAvailability;