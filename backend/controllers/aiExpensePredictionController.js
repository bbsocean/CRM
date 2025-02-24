// controllers/aiExpensePredictionController.js
const AIExpensePrediction = require("../models/AIExpensePrediction");

exports.getExpensePredictions = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const expensePredictions = await AIExpensePrediction.find({ timeframe });

    res.status(200).json(expensePredictions);
  } catch (error) {
    console.error("Error fetching AI expense prediction data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
