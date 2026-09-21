import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FALLBACK_USD_TO_NGN_RATE = 1650;
const EXCHANGE_RATE_CACHE_MS = 5 * 60 * 1000; // 5 minutes

let cachedRate = null;
let cachedRateAt = 0;

// The client used to fetch this same public rate and hand the server a
// pre-converted amount, which meant the amount charged was whatever the
// client said it was. Fetching it here instead, with a short cache and a
// fixed fallback, keeps the server as the sole source of truth for price.
export const getUsdToNgnRate = async () => {
  const now = Date.now();
  if (cachedRate && now - cachedRateAt < EXCHANGE_RATE_CACHE_MS) {
    return cachedRate;
  }

  try {
    const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
    const rate = response.data?.rates?.NGN;

    if (typeof rate === "number" && rate > 0) {
      cachedRate = rate;
      cachedRateAt = now;
      return rate;
    }
  } catch (error) {
    console.error("Failed to fetch USD->NGN exchange rate, using fallback:", error.message);
  }

  return cachedRate || FALLBACK_USD_TO_NGN_RATE;
};

const loadRoomFromJson = (roomId) => {
  const roomDataPath = path.join(__dirname, "../../Hotel Website/src/lib/allRooms.json");
  const allRoomsData = JSON.parse(fs.readFileSync(roomDataPath, "utf8"));
  return allRoomsData.find((r) => String(r.id) === String(roomId));
};

// Room price (USD) is looked up server-side by roomId — never trust a
// client-supplied price. DB is authoritative when present, JSON is the
// fallback for rooms that only exist in the static catalog.
export const getRoomPriceUsd = async (roomId) => {
  const { rows } = await pool.query(`SELECT price FROM rooms WHERE room_id = $1`, [roomId]);
  if (rows.length > 0 && rows[0].price != null) {
    return Number(rows[0].price);
  }

  const jsonRoom = loadRoomFromJson(roomId);
  if (jsonRoom && jsonRoom.price != null) {
    return Number(jsonRoom.price);
  }

  return null;
};

export const getRoomName = async (roomId) => {
  const { rows } = await pool.query(`SELECT name FROM rooms WHERE room_id = $1`, [roomId]);
  if (rows.length > 0 && rows[0].name) {
    return rows[0].name;
  }

  const jsonRoom = loadRoomFromJson(roomId);
  return jsonRoom?.name || null;
};

export const calculateNights = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
};

/**
 * Computes the authoritative price for a stay, entirely from server-known
 * data (DB/JSON room price + a server-fetched exchange rate). Returns null
 * if the room or dates are invalid so the caller can reject the request.
 */
export const computeBookingPrice = async (roomId, checkIn, checkOut) => {
  const nights = calculateNights(checkIn, checkOut);
  if (nights <= 0) return null;

  const priceUsd = await getRoomPriceUsd(roomId);
  if (priceUsd == null) return null;

  const totalPriceUsd = priceUsd * nights;
  const rate = await getUsdToNgnRate();
  const totalPriceNgn = Math.round(totalPriceUsd * rate);
  const amountKobo = totalPriceNgn * 100;

  return { nights, priceUsd, totalPriceUsd, rate, totalPriceNgn, amountKobo };
};
