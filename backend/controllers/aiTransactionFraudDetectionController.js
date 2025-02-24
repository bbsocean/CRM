// controllers/aiTransactionFraudDetectionController.js
const AITransactionFraudDetection = require("../models/AITransactionFraudDetection");

exports.getFraudulentTransactions = async (req, res) => {
  try {
    const transactions = await AITransactionFraudDetection.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching fraudulent transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
