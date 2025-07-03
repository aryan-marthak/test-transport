import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express()
dotenv.config()

const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5001;

try {
    mongoose.connect(URI);
    console.log("MongoDB Connected!");
} catch (error) {
    console.log(error);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
