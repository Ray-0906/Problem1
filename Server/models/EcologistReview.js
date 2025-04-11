import mongoose from "mongoose";

const ecologistReviewSchema = new mongoose.Schema(
  {
    observation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantObservation",
      required: true,
    },
    ecologist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status:{ type: String, enum: ["endangered", "not endangered"], default: "not endangered" },
    finalSpecies: { type: String, required: true},
    notes: { type: String },
    isConfirmed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EcologistReview = mongoose.model(
  "EcologistReview",
  ecologistReviewSchema
);
export default EcologistReview;
