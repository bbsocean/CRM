// controllers/aiDatabaseOptimizerController.js
const AIDatabaseOptimizer = require("../models/AIDatabaseOptimizer");

exports.getDatabaseMetrics = async (req, res) => {
  try {
    const dbMetrics = await AIDatabaseOptimizer.find();
    res.status(200).json(dbMetrics);
  } catch (error) {
    console.error("Error fetching AI database optimization data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.optimizeDatabase = async (req, res) => {
  try {
    await AIDatabaseOptimizer.updateMany({}, { $set: { optimizationSuggestion: "Optimized" } });
    res.status(200).json({ message: "AI Database Optimization initiated successfully!" });
  } catch (error) {
    console.error("Error optimizing database:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
