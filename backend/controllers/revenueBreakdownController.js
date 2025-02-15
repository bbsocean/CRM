const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Commission = require("../models/Commission");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Get Revenue Breakdown by Source (Sales, Commissions, Bonuses)
router.get("/breakdown", verifyToken, async (req, res) => {
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

    const salesRevenue = await Transaction.aggregate([
      { $match: { ...matchCondition, type: "sale" } },
      { $group: { _id: groupBy, totalSales: { $sum: "$amount" } } },
    ]);

    const commissionRevenue = await Commission.aggregate([
      { $match: matchCondition },
      { $group: { _id: groupBy, totalCommissions: { $sum: "$commissionAmount" } } },
    ]);

    res.json({ success: true, data: { salesRevenue, commissionRevenue } });
  } catch (error) {
    console.error("Revenue Breakdown Error:", error);
    res.status(500).json({ message: "Error fetching revenue breakdown." });
  }
});

// ✅ Get Individual User's Revenue Breakdown
router.get("/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const salesRevenue = await Transaction.aggregate([
      { $match: { userId, type: "sale" } },
      { $group: { _id: null, totalSales: { $sum: "$amount" } } },
    ]);

    const commissionRevenue = await Commission.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalCommissions: { $sum: "$commissionAmount" } } },
    ]);

    res.json({ success: true, data: { salesRevenue, commissionRevenue } });
  } catch (error) {
    console.error("User Revenue Breakdown Error:", error);
    res.status(500).json({ message: "Error fetching user revenue breakdown." });
  }
});

module.exports = router;
