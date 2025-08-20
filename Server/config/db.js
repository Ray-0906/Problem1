import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set. Please add it to your .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error?.message);
    console.error("If you're using Atlas, whitelist your IP or set '0.0.0.0/0' temporarily.");
    console.error("Atlas Network Access: https://www.mongodb.com/docs/atlas/security-whitelist/");
    process.exit(1);
  }
};

export default connectDB;