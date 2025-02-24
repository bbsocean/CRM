// controllers/aiSystemHealthMonitorController.js
const AISystemHealthMonitor = require("../models/AISystemHealthMonitor");

exports.getSystemHealth = async (req, res) => {
  try {
    const systemHealth = await AISystemHealthMonitor.find();
    res.status(200).json(systemHealth);
  } catch (error) {
    console.error("Error fetching AI system health data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.optimizeSystem = async (req, res) => {
  try {
    await AISystemHealthMonitor.updateMany({}, { $set: { recommendation: "Optimized" } });
    res.status(200).json({ message: "System optimization initiated successfully!" });
  } catch (error) {
    console.error("Error optimizing system:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
