// controllers/aiSalesOptimizerController.js
const AISalesOptimizer = require("../models/AISalesOptimizer");

exports.getSalesOptimizationData = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const salesData = await AISalesOptimizer.find({ timeframe });

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error fetching AI sales optimization data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
