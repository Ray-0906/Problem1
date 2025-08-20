import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getLeaderboard, getMyRewards } from "../controllers/rewardController.js";

const router = express.Router();

router.get("/me", protect, getMyRewards);
router.get("/leaderboard", protect, getLeaderboard);

export default router;
