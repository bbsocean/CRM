// controllers/aiSalesPredictorController.js
const AISalesPredictor = require("../models/AISalesPredictor");

exports.getSalesPredictions = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const salesPredictions = await AISalesPredictor.find({ timeframe });

    res.status(200).json(salesPredictions);
  } catch (error) {
    console.error("Error fetching AI sales prediction data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
