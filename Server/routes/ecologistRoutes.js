import express from "express";
import {
  getPendingEcologistReviews,
  getPendingObservations,
  reviewObservation,
  getRangerTasks,
  completeRangerTask,
} from "../controllers/ecologistController.js";
import { protect, ecologistOnly } from "../middlewares/authMiddleware.js";
import { updateObservationReview } from "../controllers/ecologistController.js";

const router = express.Router();

// Get all observations that need ecologist review
router.get("/pending", getPendingObservations);
router.get("/unconfirmed",getPendingEcologistReviews);

// Review and update an observation (status / identification)
router.put("/review/:id",protect , updateObservationReview);

// Ranger: list tasks that require assistance
router.get("/ranger/tasks", protect, getRangerTasks);
// Ranger: complete a specific task (by ecologist review id)
router.post("/ranger/tasks/:id/complete", protect, completeRangerTask);

export default router;
// This code defines the routes for ecologists to review plant observations.
