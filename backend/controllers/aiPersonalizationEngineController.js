// controllers/aiPersonalizationEngineController.js
const AIPersonalization = require("../models/AIPersonalization");

exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const recommendations = await AIPersonalization.find();
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching AI personalization recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
