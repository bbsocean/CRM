// controllers/aiAutoScalingSecurityController.js
const AIAutoScalingSecurity = require("../models/AIAutoScalingSecurity");

exports.getSecurityData = async (req, res) => {
  try {
    const securityData = await AIAutoScalingSecurity.find();
    res.status(200).json(securityData);
  } catch (error) {
    console.error("Error fetching AI security scaling data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.triggerSecurityUpgrade = async (req, res) => {
  try {
    await AIAutoScalingSecurity.updateMany({}, { $set: { status: "Upgrading", threatLevel: 30 } });
    res.status(200).json({ message: "Security Upgrade Triggered" });
  } catch (error) {
    console.error("Error triggering security upgrade:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
