// controllers/aiPerformanceOptimizationController.js

const AIPerformanceOptimization = require("../models/AIPerformanceOptimization");

exports.getPerformanceMetrics = async (req, res) => {
  try {
    const performanceMetrics = await AIPerformanceOptimizer.find();
    res.status(200).json(performanceMetrics);
  } catch (error) {
    console.error("Error fetching AI performance data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.optimizePerformance = async (req, res) => {
  try {
    await AIPerformanceOptimizer.updateMany({}, { $set: { optimizationSuggestion: "Optimized" } });
    res.status(200).json({ message: "Performance optimization initiated successfully!" });
  } catch (error) {
    console.error("Error optimizing performance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
