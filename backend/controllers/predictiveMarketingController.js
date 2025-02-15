// controllers/predictiveMarketingController.js
const PredictiveMarketing = require("../models/PredictiveMarketing");

exports.getPredictiveMarketingData = async (req, res) => {
  try {
    const campaigns = await PredictiveMarketing.find();
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching predictive marketing data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
