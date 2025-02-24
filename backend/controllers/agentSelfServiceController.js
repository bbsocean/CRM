const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Get Agent Sales & Commissions
router.get("/sales-commissions", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ agentId: req.user.id });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Agent Sales & Commissions Error:", error);
    res.status(500).json({ message: "Error fetching sales and commissions." });
  }
});

module.exports = router;
