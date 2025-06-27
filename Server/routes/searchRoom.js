import express from "express";
import searchAvailableRoom from "../controllers/searchRooms.js";

const router = express.Router();

router.get('/available', searchAvailableRoom);

export default router;