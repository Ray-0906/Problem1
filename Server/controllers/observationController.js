import { uploadToCloudinary } from "../config/cloudinary.js";
import PlantObservation from "../models/PlantObservation.js";
import User from "../models/user.js";
import { runMLModel1, runMLModel3} from "../utils/runMLModel.js"; // we will build this
import fs from 'fs';

export const createObservation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const prediction = await runMLModel1(req.file.path);
     const imageBuffer = fs.readFileSync(req.file.path); // read buffer from disk
    const cloudinaryResult = await uploadToCloudinary(imageBuffer, {
      folder: 'plant-observations',
    });
    console.log("Cloudinary upload result:", cloudinaryResult.secure_url);
    // Upload image to Cloudinary
    const observation = new PlantObservation({
      user: req.user._id,
      imageUrl: cloudinaryResult.secure_url,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      prediction: {
        species: prediction.species,
        confidence: prediction.confidence,
        status: prediction.confidence > 0.6 ? "model-identified" : "pending",
      },
      isReviewed: false,
      status: "not endangered", // default, as per your schema
    });

    const createdObservation = await observation.save();

    // Maintain user-observation relationship
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { plantObservations: createdObservation._id } },
      { new: true }
    );

    res.status(201).json(createdObservation);
  } catch (error) {
    console.error("Error creating observation:", error);
    res.status(500).json({ message: "Failed to create observation" });
  }
};


export const detectPlantDisease = async (req, res) => {
  try {
    const imagePath = req.file.path;

    // 🔥 Run your ML model
    const result = await runMLModel3(imagePath);
   
    console.log("Model result:", result);
    // ✅ Send JSON response
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in detectPlantDisease controller:", error);
    res.status(500).json({ error: "Failed to detect plant disease" });
  }
};

export const getAllObservations = async (req, res) => {
  const observations = await PlantObservation.find().populate(
    "user",
    "name email"
  );
  res.json(observations);
};

// controller.js
// update the path as needed

export const getNearbyObservations = async (req, res) => {
  try {
    const { latitude, longitude, radiusInKm } = req.query;

    if (!latitude || !longitude || !radiusInKm) {
      return res.status(400).json({ message: "Missing latitude, longitude or radiusInKm" });
    }

    const observations = await PlantObservation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(radiusInKm) * 1000, // convert km to meters
        },
      },
      // status: "endangered",
      isReviewed:false
      // filter by status if needed
    });
 // console.log("Nearby observations:", observations);
    res.json(observations);
  } catch (err) {
    console.error("Error fetching nearby observations:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserObservations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "plantObservations"
    );
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
   
  // console.log(" recived  recieved");
  try {
    const observations = await PlantObservation.find({
    // status: "endangered",
    }).select("prediction.species status location.coordinates");

    const formatted = observations.map((obs) => ({
      name: obs.prediction?.species || "Unknown Species",
      status: obs.status,
      coordinates: obs.location.coordinates, // [lng, lat]
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching endangered species:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveObservation = async (req, res) => {
  const observationId = req.params.id;

  const obs = await PlantObservation.findById(observationId).populate("user");
  console.log("recived  ...");
  if (!obs) return res.status(404).send("Observation not found");

  obs.prediction.status = "ecologist-reviewed";
  obs.isReviewed = true;
  await obs.save();
  const user = obs.user;
  user.exp = (user.exp || 0) + 50;
  await user.save();
   
  res.json({ success: true, message: "Approved and rewarded" });
};
