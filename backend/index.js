import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import driverRoutes from "./routes/driver.route.js";
import vehicleRoutes from "./routes/vehicle.route.js";
import tripRequestRoutes from "./routes/trip.request.js";

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
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tripRequest', tripRequestRoutes);

if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();
    app.use(express.static("./frontend/dist"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(dirPath, "./frontend/dist", "index.html"));} 
    );
}

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
