// controllers/aiSalesForecastingController.js
const AISalesForecasting = require("../models/AISalesForecasting");

exports.getSalesForecast = async (req, res) => {
  try {
    const { timeframe } = req.query;
    let forecastData;

    if (timeframe === "Monthly") {
      forecastData = await AISalesForecasting.find({ period: "Monthly" });
    } else if (timeframe === "Quarterly") {
      forecastData = await AISalesForecasting.find({ period: "Quarterly" });
    } else if (timeframe === "Yearly") {
      forecastData = await AISalesForecasting.find({ period: "Yearly" });
    } else {
      forecastData = await AISalesForecasting.find();
    }

    res.status(200).json(forecastData);
  } catch (error) {
    console.error("Error fetching AI sales forecast data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
