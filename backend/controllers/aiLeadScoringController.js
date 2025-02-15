// controllers/aiLeadScoringController.js
const AILeadScoring = require("../models/AILeadScoring");

exports.getLeadScoring = async (req, res) => {
  try {
    const minScore = req.query.minScore ? parseInt(req.query.minScore) : 0;
    const leads = await AILeadScoring.find({ score: { $gte: minScore } });
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching AI lead scoring data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
