// controllers/aiBehaviorAnalysisController.js
const AIBehaviorAnalysis = require("../models/AIBehaviorAnalysis");

exports.getBehaviorData = async (req, res) => {
  try {
    const { type } = req.query;
    const behaviorData = await AIBehaviorAnalysis.find({ behaviorType: type });

    res.status(200).json(behaviorData);
  } catch (error) {
    console.error("Error fetching AI behavior analysis data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
