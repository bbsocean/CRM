// controllers/aiTaxCalculationController.js
const AITaxCalculation = require("../models/AITaxCalculation");

exports.getTaxCalculations = async (req, res) => {
  try {
    const { taxType } = req.query;
    const taxCalculations = await AITaxCalculation.find({ taxType });

    res.status(200).json(taxCalculations);
  } catch (error) {
    console.error("Error fetching AI tax calculation data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
