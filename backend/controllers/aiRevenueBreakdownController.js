// controllers/aiRevenueBreakdownController.js
const AIRevenueBreakdown = require("../models/AIRevenueBreakdown");

exports.getRevenueBreakdown = async (req, res) => {
  try {
    const revenueData = await AIRevenueBreakdown.find();
    res.status(200).json(revenueData);
  } catch (error) {
    console.error("Error fetching AI revenue breakdown data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
