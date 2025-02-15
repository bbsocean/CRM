// controllers/aiIncidentResponseController.js
const AIIncidentResponse = require("../models/AIIncidentResponse");

exports.getIncidentReports = async (req, res) => {
  try {
    const incidents = await AIIncidentResponse.find();
    res.status(200).json(incidents);
  } catch (error) {
    console.error("Error fetching AI incident reports:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.resolveIncidents = async (req, res) => {
  try {
    await AIIncidentResponse.updateMany({}, { $set: { status: "Resolved" } });
    res.status(200).json({ message: "AI Incident Response triggered successfully!" });
  } catch (error) {
    console.error("Error resolving incidents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
