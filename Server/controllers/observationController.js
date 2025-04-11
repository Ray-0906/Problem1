import PlantObservation from "../models/PlantObservation.js";
import User from "../models/user.js";
import runMLModel from "../utils/runMLModel.js"; // we will build this

export const createObservation = async (req, res) => {
  const { latitude, longitude } = req.body;

 // const prediction = await runMLModel(req.file.path);
  
  const prediction = {
    species: "Test Species",
    confidence: 0.75,
  };
 console.log(req.file.path);
  const observation = new PlantObservation({
    user: req.user._id,
    imageUrl: req.file.path,
    location: { type: "Point", coordinates: [longitude, latitude] },
    predictedSpecies: prediction.species,
    status: prediction.confidence > 0.8 ? "confirmed" : "pending_review",
  });
 
  const createdObservation = await observation.save();

  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { plantObservations: createdObservation._id } },
    { new: true }
  );

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

export const getUserObservations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("plantObservations");
  //  console.log(user.plantObservations);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.plantObservations);
  } catch (error) {
    console.error("Error fetching user observations:", error);
    res.status(500).json({ message: "Failed to fetch observations" });
  }
};

// controllers/plantObservationController.js

//import PlantObservation from '../models/observeplantations.js';

export const getEndangeredSpecies = async (req, res) => {
  try {
    const observations = await PlantObservation.find({ status: 'endangered' }).select(
      'prediction.species status location.coordinates'
    );

    const formatted = observations.map(obs => ({
      name: obs.prediction?.species || 'Unknown Species',
      status: obs.status,
      coordinates: obs.location.coordinates, // [lng, lat]
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching endangered species:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
