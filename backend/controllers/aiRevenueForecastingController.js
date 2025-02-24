// controllers/aiRevenueForecastingController.js
const AIRevenueForecasting = require("../models/AIRevenueForecasting");

exports.getAIRevenueForecasting = async (req, res) => {
  try {
    const forecastData = await AIRevenueForecasting.find();
    res.status(200).json(forecastData);
  } catch (error) {
    console.error("Error fetching AI revenue forecast data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
