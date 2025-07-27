import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import http from "http";
import authRoutes from "./routes/authRoutes.js";
import observationRoutes from "./routes/observationRoutes.js";
import ecologistRoutes from "./routes/ecologistRoutes.js";

import climateRoutes from "./routes/climateRoutes.js";

import { getEndangeredSpecies, getUserObservations } from "./controllers/observationController.js";
import { protect } from "./middlewares/authMiddleware.js";
import { getPendingEcologistReviews } from "./controllers/ecologistController.js";
import socketHandler from "./sockets/signaling.js";



const app = express();

// Middlewares
app.use(cors(
  {
    origin: true, // Adjust to your frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies to be sent
  }
));
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

//Sockets
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: true, // Adjust to your frontend URL
    methods: ["GET", "POST"],
  },
});
socketHandler(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));