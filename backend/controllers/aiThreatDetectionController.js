// controllers/aiThreatDetectionController.js
const AIThreatDetection = require("../models/AIThreatDetection");

exports.getThreatData = async (req, res) => {
  try {
    const threatData = await AIThreatDetection.find();
    res.status(200).json(threatData);
  } catch (error) {
    console.error("Error fetching AI threat detection data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.mitigateThreat = async (req, res) => {
  try {
    const { id } = req.body;
    await AIThreatDetection.findByIdAndUpdate(id, { $set: { status: "Resolved", riskLevel: 10 } });
    res.status(200).json({ message: "Threat mitigation initiated successfully!" });
  } catch (error) {
    console.error("Error mitigating threat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
