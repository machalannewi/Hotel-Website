import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import roomsRouter from "./routes/rooms.js";


const app = express()
const port = 5000;

app.use(express.json())

dotenv.config();
app.use(cors({ origin: "http://localhost:5174" }));

// Routes
app.use('/api/rooms', roomsRouter);

app.listen(port, () => {
    console.log(`Server running on ${port}`)
});