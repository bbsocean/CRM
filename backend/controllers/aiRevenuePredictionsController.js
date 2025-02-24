// controllers/aiRevenuePredictionsController.js
const AIRevenuePredictions = require("../models/AIRevenuePredictions");

exports.getRevenuePredictions = async (req, res) => {
  try {
    const { timeframe } = req.query;
    let revenueData;

    if (timeframe === "Monthly") {
      revenueData = await AIRevenuePredictions.find({ period: "Monthly" });
    } else if (timeframe === "Quarterly") {
      revenueData = await AIRevenuePredictions.find({ period: "Quarterly" });
    } else if (timeframe === "Yearly") {
      revenueData = await AIRevenuePredictions.find({ period: "Yearly" });
    } else {
      revenueData = await AIRevenuePredictions.find();
    }

    res.status(200).json(revenueData);
  } catch (error) {
    console.error("Error fetching AI revenue predictions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
