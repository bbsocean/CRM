// controllers/aiResourceAllocatorController.js
const AIResourceAllocator = require("../models/AIResourceAllocator");

exports.getResourceMetrics = async (req, res) => {
  try {
    const resourceMetrics = await AIResourceAllocator.find();
    res.status(200).json(resourceMetrics);
  } catch (error) {
    console.error("Error fetching AI resource allocation data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.optimizeResources = async (req, res) => {
  try {
    await AIResourceAllocator.updateMany({}, { $set: { optimizationSuggestion: "Optimized" } });
    res.status(200).json({ message: "AI Resource Optimization initiated successfully!" });
  } catch (error) {
    console.error("Error optimizing resources:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
