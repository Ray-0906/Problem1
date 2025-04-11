import express from "express";
import { suggestTreesController } from "../controllers/climateController.js";

const router = express.Router();

router.post("/suggest-trees", suggestTreesController);

export default router;
// This code defines a route for suggesting trees based on climate data.