import express from "express";
import {
  approveObservation,
  createObservation,
  getAllObservations,
  getEndangeredSpecies,
  getNearbyObservations,
  getUserObservations,
  detectPlantDisease,
} from "../controllers/observationController.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"; // Multer config

const router = express.Router();

// Create a new observation (with image upload)
router.post("/", protect, upload.single("image"), createObservation);

// Nearby geo query
router.get("/nearby", protect, getNearbyObservations);

// Approve an observation
router.get("/approve/:id", protect, approveObservation);

// Detect plant disease
router.post("/detect", upload.single("image"), detectPlantDisease);

// Endangered list
router.get("/endangered", protect, getEndangeredSpecies);

// Current user's observations
router.get("/user", protect, (req, res) => {
  console.log("User ID:", req.user._id);
  getUserObservations(req, res);
});

// Get all observations
router.get("/", protect, getAllObservations);

export default router;
// Routes for creating and retrieving plant observations.