const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const { analyzeTrends } = require("../utils/aiEngine"); // AI logic file

// ✅ Predict Future Commissions & Sales Trends (AI-powered)
router.get("/predict", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find();
    
    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found for AI analysis." });
    }

    const prediction = analyzeTrends(transactions); // AI-based function

    res.json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error("AI Insights Error:", error);
    res.status(500).json({ message: "Error generating AI-based predictions." });
  }
});

module.exports = router;
