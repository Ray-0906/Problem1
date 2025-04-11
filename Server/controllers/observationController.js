import PlantObservation from "../models/PlantObservation.js";
import runMLModel from "../utils/runMLModel.js"; // we will build this

export const createObservation = async (req, res) => {
  const { latitude, longitude } = req.body;

  const prediction = await runMLModel(req.file.path);

  const observation = new PlantObservation({
    user: req.user._id,
    image: req.file.path,
    location: { type: "Point", coordinates: [longitude, latitude] },
    predictedSpecies: prediction.species,
    status: prediction.confidence > 0.8 ? "confirmed" : "pending_review",
  });

  const createdObservation = await observation.save();
  res.status(201).json(createdObservation);
};

export const getAllObservations = async (req, res) => {
  const observations = await PlantObservation.find().populate(
    "user",
    "name email"
  );
  res.json(observations);
};

export const getNearbyObservations = async (req, res) => {
  const { latitude, longitude, distance } = req.query;
  const radius = distance / 6378.1;

  const observations = await PlantObservation.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.json(observations);
};
