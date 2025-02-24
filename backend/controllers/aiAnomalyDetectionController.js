// controllers/aiAnomalyDetectionController.js
const AIAnomalyDetection = require("../models/AIAnomalyDetection");

exports.getAnomalyData = async (req, res) => {
  try {
    const anomalies = await AIAnomalyDetection.find();
    res.status(200).json(anomalies);
  } catch (error) {
    console.error("Error fetching AI anomaly detection data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resolveAnomaly = async (req, res) => {
  try {
    const { id } = req.body;
    await AIAnomalyDetection.findByIdAndUpdate(id, { $set: { status: "Resolved", riskLevel: 10 } });
    res.status(200).json({ message: "Anomaly resolution initiated successfully!" });
  } catch (error) {
    console.error("Error resolving anomaly:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
