const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Commission = require("../models/Commission");
const BonusReward = require("../models/BonusReward");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Get Total Revenue (Sales, Commissions, Bonuses)
router.get("/total", verifyToken, isAdmin, async (req, res) => {
  try {
    const totalSales = await Transaction.aggregate([{ $group: { _id: null, totalAmount: { $sum: "$amount" } } }]);
    const totalCommissions = await Commission.aggregate([{ $group: { _id: null, totalEarnings: { $sum: "$commissionAmount" } } }]);
    const totalBonuses = await BonusReward.aggregate([{ $group: { _id: null, totalBonuses: { $sum: "$bonusAmount" } } }]);

    res.json({
      success: true,
      data: {
        totalSales: totalSales.length ? totalSales[0].totalAmount : 0,
        totalCommissions: totalCommissions.length ? totalCommissions[0].totalEarnings : 0,
        totalBonuses: totalBonuses.length ? totalBonuses[0].totalBonuses : 0,
      },
    });
  } catch (error) {
    console.error("Total Revenue Fetch Error:", error);
    res.status(500).json({ message: "Error fetching total revenue." });
  }
});

// ✅ Get Revenue by Role (Franchise, Territory Head, Agent, Vendor, Referral)
router.get("/by-role", verifyToken, isAdmin, async (req, res) => {
  try {
    const roleRevenue = await Transaction.aggregate([
      { $group: { _id: "$role", totalRevenue: { $sum: "$amount" } } },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.json({ success: true, data: roleRevenue });
  } catch (error) {
    console.error("Revenue By Role Error:", error);
    res.status(500).json({ message: "Error fetching revenue by role." });
  }
});

// ✅ Get Revenue Trends Over Time (Daily, Weekly, Monthly, Yearly)
router.get("/trends", verifyToken, isAdmin, async (req, res) => {
  try {
    const { timeframe } = req.query;

    let groupBy = {};
    if (timeframe === "daily") groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } };
    else if (timeframe === "weekly") groupBy = { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } };
    else if (timeframe === "monthly") groupBy = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
    else if (timeframe === "yearly") groupBy = { year: { $year: "$createdAt" } };
    else return res.status(400).json({ message: "Invalid timeframe parameter" });

    const revenueTrends = await Transaction.aggregate([
      { $group: { _id: groupBy, totalRevenue: { $sum: "$amount" } } },
      { $sort: { "_id": 1 } },
    ]);

    res.json({ success: true, data: revenueTrends });
  } catch (error) {
    console.error("Revenue Trends Error:", error);
    res.status(500).json({ message: "Error fetching revenue trends." });
  }
});

module.exports = router;
