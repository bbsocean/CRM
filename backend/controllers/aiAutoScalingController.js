// controllers/aiAutoScalingController.js
const AIAutoScaling = require("../models/AIAutoScaling");

exports.getScalingMetrics = async (req, res) => {
  try {
    const scalingMetrics = await AIAutoScaling.find();
    res.status(200).json(scalingMetrics);
  } catch (error) {
    console.error("Error fetching AI auto-scaling data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.triggerAutoScaling = async (req, res) => {
  try {
    await AIAutoScaling.updateMany({}, { $set: { scalingAction: "Scaling In Progress" } });
    res.status(200).json({ message: "Auto scaling initiated successfully!" });
  } catch (error) {
    console.error("Error triggering auto scaling:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
