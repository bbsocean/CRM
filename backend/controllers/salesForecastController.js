const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Generate Sales Forecast Based on Past Data
router.get("/forecast", verifyToken, async (req, res) => {
  try {
    const { timeframe, userId, role } = req.query;

    let matchCondition = {};
    if (userId) matchCondition.userId = userId;
    if (role) matchCondition.role = role;

    let groupBy = {};
    if (timeframe === "daily") groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } };
    else if (timeframe === "weekly") groupBy = { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } };
    else if (timeframe === "monthly") groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
    else if (timeframe === "yearly") groupBy = { year: { $year: "$createdAt" } };
    else return res.status(400).json({ message: "Invalid timeframe parameter" });

    const forecast = await Transaction.aggregate([
      { $match: matchCondition },
      { $group: { _id: groupBy, totalSales: { $sum: "$amount" } } },
      { $sort: { "_id": 1 } }
    ]);

    res.json({ success: true, data: forecast });
  } catch (error) {
    console.error("Sales Forecasting Error:", error);
    res.status(500).json({ message: "Error generating sales forecast." });
  }
});

// ✅ Get Individual User’s Sales Data
router.get("/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Fetch User Sales Data Error:", error);
    res.status(500).json({ message: "Error fetching user sales data." });
  }
});

module.exports = router;
