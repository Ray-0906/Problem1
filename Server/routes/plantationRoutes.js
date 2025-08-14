import express from "express";
import { protect, ecologistOnly } from "../middlewares/authMiddleware.js";
import {
  startVerification,
  listMyVerifications,
  rangerPendingVerifications,
  acceptVerification,
  completeVerification,
} from "../controllers/plantationController.js";

const router = express.Router();

// User starts a verification attempt
router.post("/start", protect, startVerification);
// User sees their attempts
router.get("/my", protect, listMyVerifications);

// Ranger (admin/ecologist) views pending
router.get("/pending", protect, rangerPendingVerifications);
// Ranger accepts a specific verification (maps to current in-call)
router.post("/:id/accept", protect, acceptVerification);
// Ranger completes with decision
router.post("/:id/complete", protect, completeVerification);

export default router;
