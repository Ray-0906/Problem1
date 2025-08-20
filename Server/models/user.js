import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Don't forget to import bcrypt!

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    exp: { type: Number, default: 0 }, // optional, useful for gamification (green points)
    role: {
      type: String,
      enum: ["user", "ecologist", "admin"],
      default: "user",
    },
    location: { type: String }, // optional, useful for region-specific features
    achievements: [{ type: String }], // optional, for tracking user achievements
    // ✅ Reference to Plant Observations (Array of ObjectIds)
    plantObservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlantObservation", // name of your model
      },
    ],
  },
  { timestamps: true }
);

// Match user-entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
// export default mongoose.model("User", userSchema);