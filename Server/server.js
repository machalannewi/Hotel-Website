import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import roomsRouter from "./routes/rooms.js";
import bookingRouter from "./routes/bookings.js";


const app = express();
const port = 5000;

app.use(express.json())

dotenv.config();
app.use(cors({ origin: "https://the-monarch-sepia.vercel.app" }));


app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingRouter);

app.listen(port, () => {
    console.log(`Server running on ${port}`)
});