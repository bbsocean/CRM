const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Commission = require("../models/Commission");
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Get Performance Overview (Sales, Commissions, User Engagement)
router.get("/overview", verifyToken, isAdmin, async (req, res) => {
  try {
    const totalSales = await Transaction.aggregate([{ $group: { _id: null, totalAmount: { $sum: "$amount" } } }]);
    const totalCommission = await Commission.aggregate([{ $group: { _id: null, totalEarnings: { $sum: "$commissionAmount" } } }]);
    const activeUsers = await User.countDocuments({ lastLogin: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } });

    res.json({
      success: true,
      data: {
        totalSales: totalSales.length ? totalSales[0].totalAmount : 0,
        totalCommission: totalCommission.length ? totalCommission[0].totalEarnings : 0,
        activeUsers,
      },
    });
  } catch (error) {
    console.error("Performance Analytics Overview Error:", error);
    res.status(500).json({ message: "Error fetching performance overview." });
  }
});

// ✅ Get Performance by Role (Franchise, Territory Head, Agent, Vendor, Referral)
router.get("/by-role", verifyToken, isAdmin, async (req, res) => {
  try {
    const roleStats = await User.aggregate([
      { $group: { _id: "$role", userCount: { $sum: 1 } } },
      { $sort: { userCount: -1 } },
    ]);

    res.json({ success: true, data: roleStats });
  } catch (error) {
    console.error("Performance By Role Error:", error);
    res.status(500).json({ message: "Error fetching performance by role." });
  }
});

// ✅ Get Performance Trends Over Time (Daily, Weekly, Monthly, Yearly)
router.get("/trends", verifyToken, isAdmin, async (req, res) => {
  try {
    const { timeframe } = req.query;

    let groupBy = {};
    if (timeframe === "daily") groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } };
    else if (timeframe === "weekly") groupBy = { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } };
    else if (timeframe === "monthly") groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
    else if (timeframe === "yearly") groupBy = { year: { $year: "$createdAt" } };
    else return res.status(400).json({ message: "Invalid timeframe parameter" });

    const performanceTrends = await Transaction.aggregate([
      { $group: { _id: groupBy, totalSales: { $sum: "$amount" } } },
      { $sort: { "_id": 1 } },
    ]);

    res.json({ success: true, data: performanceTrends });
  } catch (error) {
    console.error("Performance Trends Error:", error);
    res.status(500).json({ message: "Error fetching performance trends." });
  }
});

module.exports = router;
