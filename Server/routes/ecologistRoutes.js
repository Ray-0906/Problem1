import express from "express";
import {
  getPendingObservations,
  reviewObservation,
} from "../controllers/ecologistController.js";
import { protect, ecologistOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all observations that need ecologist review
router.get("/pending", protect, ecologistOnly, getPendingObservations);

// Review and update an observation (status / identification)
router.put("/:id/review", protect, ecologistOnly, reviewObservation);

export default router;
// This code defines the routes for ecologists to review plant observations.