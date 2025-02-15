// controllers/aiAutoScalingManagementController.js
const AIAutoScaling = require("../models/AIAutoScaling");

exports.getScalingData = async (req, res) => {
  try {
    const scalingData = await AIAutoScaling.find();
    res.status(200).json(scalingData);
  } catch (error) {
    console.error("Error fetching AI auto-scaling data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.toggleAutoScaling = async (req, res) => {
  try {
    const { enabled } = req.body;
    await AIAutoScaling.updateMany({}, { $set: { autoScalingEnabled: enabled } });
    res.status(200).json({ message: "Auto scaling status updated" });
  } catch (error) {
    console.error("Error updating auto-scaling status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
