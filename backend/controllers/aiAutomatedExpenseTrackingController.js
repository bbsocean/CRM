// controllers/aiAutomatedExpenseTrackingController.js
const AIAutomatedExpenseTracking = require("../models/AIAutomatedExpenseTracking");

exports.getExpenseTrackingData = async (req, res) => {
  try {
    const expenses = await AIAutomatedExpenseTracking.find();
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching AI expense tracking data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
