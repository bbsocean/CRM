// controllers/aiProductRecommendationController.js
const AIProductRecommendation = require("../models/AIProductRecommendation");

exports.getProductRecommendations = async (req, res) => {
  try {
    const { customer } = req.query;
    const recommendations = await AIProductRecommendation.find({ customer });

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching AI product recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
