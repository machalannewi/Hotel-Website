import pool from "../config/db.js";

const inputAvailableRoom = async (roomId, checkIn, checkOut, email, phone, fullName, guests, promoCode, totalPrice) => {
    const query = `
      INSERT INTO reservations (room_id, check_in, check_out, email, phone, full_name, guest, promo_code, total_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;
  const { rows } = await pool.query(query, [
    roomId,
    checkIn,
    checkOut,
    email,
    phone,
    fullName,
    guests,
    promoCode,
    totalPrice
]);
  return rows.length === 0; // True if available
};

export default inputAvailableRoom;