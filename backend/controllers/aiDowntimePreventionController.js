// controllers/aiDowntimePreventionController.js
const AIDowntimePrevention = require("../models/AIDowntimePrevention");

exports.getDowntimeData = async (req, res) => {
  try {
    const downtimeData = await AIDowntimePrevention.find();
    res.status(200).json(downtimeData);
  } catch (error) {
    console.error("Error fetching AI downtime prevention data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.triggerPreventiveAction = async (req, res) => {
  try {
    await AIDowntimePrevention.updateMany({}, { $set: { status: "In Progress", riskLevel: 30 } });
    res.status(200).json({ message: "Preventive Action Triggered" });
  } catch (error) {
    console.error("Error triggering preventive action:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
