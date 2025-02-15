const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Get Territory Head Transactions
router.get("/transactions", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ territoryHeadId: req.user.id });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Territory Head Transactions Error:", error);
    res.status(500).json({ message: "Error fetching transactions." });
  }
});

module.exports = router;
