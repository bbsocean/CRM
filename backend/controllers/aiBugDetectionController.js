// controllers/aiBugDetectionController.js
const AIBugDetection = require("../models/AIBugDetection");

exports.getBugReports = async (req, res) => {
  try {
    const bugs = await AIBugDetection.find();
    res.status(200).json(bugs);
  } catch (error) {
    console.error("Error fetching AI bug reports:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
