import PlantationVerification from "../models/PlantationVerification.js";
import User from "../models/user.js";

export const startVerification = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const doc = await PlantationVerification.create({
      user: req.user._id,
      status: "awaiting",
      location: latitude && longitude ? { type: "Point", coordinates: [longitude, latitude] } : undefined,
      callMeta: {}
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error("startVerification error:", err);
    return res.status(500).json({ message: "Failed to start verification" });
  }
};

export const listMyVerifications = async (req, res) => {
  const docs = await PlantationVerification.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json(docs);
};

export const rangerPendingVerifications = async (req, res) => {
  const docs = await PlantationVerification.find({ status: { $in: ["awaiting", "in-progress"] } })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  return res.json(docs);
};

export const acceptVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminSocketId, userSocketId } = req.body;

    const doc = await PlantationVerification.findOneAndUpdate(
      { _id: id, status: { $in: ["awaiting", "in-progress"] } },
      {
        ranger: req.user._id,
        status: "in-progress",
        acceptedAt: new Date(),
        callMeta: { adminSocketId, userSocketId }
      },
      { new: true }
    );

    if (!doc) return res.status(404).json({ message: "Verification not found or already handled" });
    return res.json(doc);
  } catch (err) {
    console.error("acceptVerification error:", err);
    return res.status(500).json({ message: "Failed to accept verification" });
  }
};

export const completeVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body; // decision: 'approved' | 'rejected'

    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    const doc = await PlantationVerification.findById(id).populate("user");
    if (!doc) return res.status(404).json({ message: "Verification not found" });

    doc.status = decision;
    doc.notes = notes;
    doc.completedAt = new Date();
    await doc.save();

    // Reward points on approval
    if (decision === "approved" && doc.user) {
      doc.user.exp = (doc.user.exp || 0) + 50; // award 50 green points
      await doc.user.save();
    }

    return res.json(doc);
  } catch (err) {
    console.error("completeVerification error:", err);
    return res.status(500).json({ message: "Failed to complete verification" });
  }
};
