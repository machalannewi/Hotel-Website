import express from "express";
import verifyRoomAvailability from "../controllers/rooms.js";

const router = express.Router();

router.get('/availability', verifyRoomAvailability);

export default router;
