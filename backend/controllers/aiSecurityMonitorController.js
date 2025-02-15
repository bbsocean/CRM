// controllers/aiSecurityMonitorController.js
const AISecurityMonitor = require("../models/AISecurityMonitor");

exports.getSecurityLogs = async (req, res) => {
  try {
    const securityLogs = await AISecurityMonitor.find();
    res.status(200).json(securityLogs);
  } catch (error) {
    console.error("Error fetching AI security logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.triggerSecurityScan = async (req, res) => {
  try {
    await AISecurityMonitor.updateMany({}, { $set: { status: "Under Review" } });
    res.status(200).json({ message: "AI Security Scan initiated successfully!" });
  } catch (error) {
    console.error("Error initiating security scan:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
