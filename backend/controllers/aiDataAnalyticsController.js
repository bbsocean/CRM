// controllers/aiDataAnalyticsController.js
const AIDataAnalytics = require("../models/AIDataAnalytics");

exports.getAnalyticsData = async (req, res) => {
  try {
    const analyticsData = await AIDataAnalytics.find();
    res.status(200).json(analyticsData);
  } catch (error) {
    console.error("Error fetching AI analytics data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
