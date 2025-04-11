import PlantObservation from "../models/PlantObservation.js";

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