import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("🚨 MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
