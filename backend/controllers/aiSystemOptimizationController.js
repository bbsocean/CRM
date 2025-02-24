// controllers/aiSystemOptimizationController.js
const AISystemOptimization = require("../models/AISystemOptimization");

exports.optimizeSystem = async (req, res) => {
  try {
    const optimizations = await AISystemOptimization.runOptimization();
    res.status(200).json({ optimization: optimizations });
  } catch (error) {
    console.error("Error running AI system optimization:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
