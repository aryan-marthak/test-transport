import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const app = express();
dotenv.config();

const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);

mongoose.connect(URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
