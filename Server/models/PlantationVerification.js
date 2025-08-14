import mongoose from "mongoose";

const PlantationVerificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ranger: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["awaiting", "in-progress", "approved", "rejected", "cancelled"],
      default: "awaiting",
      index: true,
    },
    notes: { type: String },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: undefined }, // [lng, lat]
    },
    callMeta: {
      userSocketId: { type: String },
      adminSocketId: { type: String },
    },
    startedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

PlantationVerificationSchema.index({ location: "2dsphere" });

const PlantationVerification = mongoose.model(
  "PlantationVerification",
  PlantationVerificationSchema
);

export default PlantationVerification;
