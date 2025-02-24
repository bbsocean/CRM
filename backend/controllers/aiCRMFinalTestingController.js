// controllers/aiCRMFinalTestingController.js
const AICRMFinalTesting = require("../models/AICRMFinalTesting");

exports.runFinalTesting = async (req, res) => {
  try {
    const testResults = await AICRMFinalTesting.executeTests();
    res.status(200).json({ tests: testResults });
  } catch (error) {
    console.error("Error running AI CRM final testing:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
