import express from "express";
import { suggestTreesController, reverseGeocodeCityController } from "../controllers/climateController.js";

const router = express.Router();

router.post("/suggest-trees", suggestTreesController);
router.get("/reverse-geocode", reverseGeocodeCityController);

export default router;
// This code defines a route for suggesting trees based on climate data.