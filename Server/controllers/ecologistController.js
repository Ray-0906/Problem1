import PlantObservation from "../models/PlantObservation.js";
import EcologistReview from "../models/EcologistReview.js";


export const getPendingObservations = async (req, res) => {
  try {
    const pending = await PlantObservation.find({
      "prediction.status": "pending",
    });
    // optional: populate user info
    res.status(200).json(pending);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending observations." });
  }
};

export const reviewObservation = async (req, res) => {
  const { id } = req.params;
  const { confirmedSpecies } = req.body;

  const observation = await PlantObservation.findById(id);
  if (!observation) {
    return res.status(404).json({ message: "Observation not found" });
  }

  observation.confirmedSpecies = confirmedSpecies;
  observation.status = "confirmed";
  await observation.save();

  res.json({ message: "Observation confirmed successfully", observation });
};
// This code defines the ecologist controller for handling plant observation reviews.

//import EcologistReview from "../models/EcologistReview.js";

export const getPendingEcologistReviews = async (req, res) => {
  try {
    const reviews = await EcologistReview.find({ isConfirmed: false })
      .populate("observation")
      
    const result = reviews.map((review) => {
      const coords = review.observation?.location?.coordinates || [0, 0];
      return {
        _id: review._id,
        finalSpecies: review.finalSpecies,
        status: review.status,
        notes: review.notes,
       // ecologist: review.ecologist,
        observation: review.observation,
        latitude: coords[1], // latitude is at index 1
        longitude: coords[0], // longitude is at index 0
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching ecologist reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
