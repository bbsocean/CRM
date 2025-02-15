// controllers/aiServerHealthController.js
const AIServerHealth = require("../models/AIServerHealth");

exports.getServerHealth = async (req, res) => {
  try {
    const serverHealth = await AIServerHealth.find();
    res.status(200).json(serverHealth);
  } catch (error) {
    console.error("Error fetching AI server health data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.refreshHealthStatus = async (req, res) => {
  try {
    await AIServerHealth.updateMany({}, { $set: { healthStatus: "Checked & Updated" } });
    res.status(200).json({ message: "Server health status refreshed successfully!" });
  } catch (error) {
    console.error("Error refreshing server health:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
