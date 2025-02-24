// controllers/aiProductRecommendationsController.js
const AIProductRecommendations = require("../models/AIProductRecommendations");

exports.getRecommendations = async (req, res) => {
  try {
    const recommendations = await AIProductRecommendations.find().limit(10);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching AI product recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
