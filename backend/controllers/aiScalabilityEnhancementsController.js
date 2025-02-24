// controllers/aiScalabilityEnhancementsController.js
const AIScalabilityEnhancements = require("../models/AIScalabilityEnhancements");

exports.getScalabilityData = async (req, res) => {
  try {
    const scalabilityData = await AIScalabilityEnhancements.find();
    res.status(200).json(scalabilityData);
  } catch (error) {
    console.error("Error fetching AI scalability data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
