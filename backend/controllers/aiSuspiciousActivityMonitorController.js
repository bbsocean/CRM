// controllers/aiSuspiciousActivityMonitorController.js
const AISuspiciousActivityMonitor = require("../models/AISuspiciousActivityMonitor");

exports.getSuspiciousActivities = async (req, res) => {
  try {
    const suspiciousActivities = await AISuspiciousActivityMonitor.find();
    res.status(200).json(suspiciousActivities);
  } catch (error) {
    console.error("Error fetching AI suspicious activity data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resolveSuspiciousActivity = async (req, res) => {
  try {
    const { id } = req.body;
    await AISuspiciousActivityMonitor.findByIdAndUpdate(id, { $set: { status: "Resolved", riskLevel: 10 } });
    res.status(200).json({ message: "Suspicious activity resolution initiated successfully!" });
  } catch (error) {
    console.error("Error resolving suspicious activity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
