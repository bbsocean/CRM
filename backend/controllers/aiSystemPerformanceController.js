// controllers/aiSystemPerformanceController.js
const AISystemPerformance = require("../models/AISystemPerformance");

exports.getSystemMetrics = async (req, res) => {
  try {
    const systemMetrics = await AISystemPerformance.find();
    res.status(200).json(systemMetrics);
  } catch (error) {
    console.error("Error fetching AI system performance data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.optimizeSystemPerformance = async (req, res) => {
  try {
    await AISystemPerformance.updateMany({}, { $set: { status: "Optimization in Progress" } });
    res.status(200).json({ message: "AI System Performance Optimization initiated successfully!" });
  } catch (error) {
    console.error("Error optimizing system performance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
