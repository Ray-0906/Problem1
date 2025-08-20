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
    const { confirmedSpecies, endangeredStatus, notes,rangerAssistance } = req.body;

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
      rangerAssistance: rangerAssistance,
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
    const pendingReviews = await EcologistReview.find({  rangerAssistance: true })
      .populate("observation")
      .populate("ecologist");
    
    res.status(200).json(pendingReviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending ecologist reviews." });
  }
}

// Ranger tasks: list all reviews where ranger assistance is required
export const getRangerTasks = async (req, res) => {
  try {
    const tasks = await EcologistReview.find({ rangerAssistance: true, isConfirmed: true })
      .sort({ createdAt: -1 })
      .populate("observation")
      .populate("ecologist");
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ error: "Failed to load ranger tasks" });
  }
};

// Ranger completes a task; mark assistance false and (optionally) add a note and award exp
export const completeRangerTask = async (req, res) => {
  try {
    const { id } = req.params; // review id
    const { completionNotes } = req.body;
    const review = await EcologistReview.findById(id).populate("observation");
    if (!review) return res.status(404).json({ message: "Task not found" });

    review.rangerAssistance = false;
    if (completionNotes) {
      review.notes = review.notes ? `${review.notes}\nRanger: ${completionNotes}` : `Ranger: ${completionNotes}`;
    }
    await review.save();

    // Award exp (green points) to the ranger user
    try {
      const { default: User } = await import("../models/user.js");
      const ranger = await User.findById(req.user._id);
      if (ranger) {
        ranger.exp = (ranger.exp || 0) + 25; // small reward for completing assignment
        await ranger.save();
      }
    } catch {}

    res.json({ message: "Task marked as completed", review });
  } catch (e) {
    res.status(500).json({ error: "Failed to complete task" });
  }
};

