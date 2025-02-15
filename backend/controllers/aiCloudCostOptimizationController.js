// controllers/aiCloudCostOptimizationController.js
const AICloudCostOptimization = require("../models/AICloudCostOptimization");

exports.getCostData = async (req, res) => {
  try {
    const costData = await AICloudCostOptimization.find();
    res.status(200).json(costData);
  } catch (error) {
    console.error("Error fetching AI cloud cost data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
