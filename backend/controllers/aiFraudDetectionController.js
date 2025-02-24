// controllers/aiFraudDetectionController.js
const AIFraudDetection = require("../models/AIFraudDetection");

exports.getFraudCases = async (req, res) => {
  try {
    const fraudCases = await AIFraudDetection.find();
    res.status(200).json(fraudCases);
  } catch (error) {
    console.error("Error fetching AI fraud detection data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resolveFraudCase = async (req, res) => {
  try {
    const { id } = req.body;
    await AIFraudDetection.findByIdAndUpdate(id, { $set: { status: "Resolved", riskLevel: 10 } });
    res.status(200).json({ message: "Fraud case resolution initiated successfully!" });
  } catch (error) {
    console.error("Error resolving fraud case:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
