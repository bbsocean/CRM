// controllers/aiCustomerInsightsController.js
const AICustomerInsights = require("../models/AICustomerInsights");

exports.getCustomerInsights = async (req, res) => {
  try {
    const { type } = req.query;
    const insights = await AICustomerInsights.find({ insightType: type });

    res.status(200).json(insights);
  } catch (error) {
    console.error("Error fetching AI customer insights data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
