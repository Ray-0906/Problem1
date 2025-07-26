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

export const updateObservationReview = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id) ;
    const { confirmedSpecies, endangeredStatus, notes } = req.body;

    // Find the observation by ID
    const observation = await PlantObservation.findById(id);
    if (!observation) {
      return res.status(404).json({ message: "Observation not found." });
    }

    // Update observation fields:
    // - Update the species name in the prediction object.
    // - Mark the prediction as ecologist-reviewed.
    // - Update the overall status field (endangered or not endangered).
    // - Mark as reviewed.
    observation.prediction.species = confirmedSpecies;
    observation.prediction.status = "ecologist-reviewed";
    observation.status = endangeredStatus; // should be either "endangered" or "not endangered"
    observation.isReviewed = true;

    await observation.save();

    // Create a new EcologistReview document
    const newReview = new EcologistReview({
      observation: observation._id,
      ecologist: req.user._id, // assuming req.user is set by your auth middleware
      status: endangeredStatus, // endangered or not endangered
      finalSpecies: confirmedSpecies,
      notes: notes,
      isConfirmed: true,
    });

    const savedReview = await newReview.save();

    res.status(200).json({
      message: "Observation review updated successfully.",
      observation,
      review: savedReview,
    });
  } catch (error) {
    console.error("Error updating observation review:", error);
    res.status(500).json({ error: "Failed to update observation review." });
  }
};

export const getPendingEcologistReviews = async (req, res) => {
  try {
    const pendingReviews = await EcologistReview.find({ isConfirmed: false })
      .populate("observation")
      .populate("ecologist");
    
    res.status(200).json(pendingReviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending ecologist reviews." });
  }
}