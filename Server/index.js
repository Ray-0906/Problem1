import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import observationRoutes from "./routes/observationRoutes.js";
import ecologistRoutes from "./routes/ecologistRoutes.js";

import climateRoutes from "./routes/climateRoutes.js";

import { getEndangeredSpecies, getUserObservations } from "./controllers/observationController.js";
import { protect } from "./middlewares/authMiddleware.js";
import { getPendingEcologistReviews } from "./controllers/ecologistController.js";



const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Connect to DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/observations", observationRoutes);
app.use("/api/ecologist", ecologistRoutes);
app.use("/api/climate", climateRoutes);

// Default Route
app.get("/usersplant",protect,getUserObservations);
app.get("/unconfirmed",protect,getPendingEcologistReviews);
app.get("/endangered", getEndangeredSpecies);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));