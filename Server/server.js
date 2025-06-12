import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import bodyParser from "body-parser";


const app = express()
const port = 5000;

dotenv()
app.use(cors({ origin: "http://localhost:5174" }));

app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, () => {
    console.log(`Server running on ${port}`)
})