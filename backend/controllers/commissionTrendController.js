const express = require("express");
const router = express.Router();
const Commission = require("../models/Commission");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Get Commission Trends (Daily, Weekly, Monthly, Yearly)
router.get("/trends", verifyToken, async (req, res) => {
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

    const trends = await Commission.aggregate([
      { $match: matchCondition },
      { $group: { _id: groupBy, totalCommission: { $sum: "$commissionAmount" } } },
      { $sort: { "_id": 1 } }
    ]);

    res.json({ success: true, data: trends });
  } catch (error) {
    console.error("Fetch Commission Trends Error:", error);
    res.status(500).json({ message: "Error fetching commission trends." });
  }
});

// ✅ Get Individual User’s Commission Trends
router.get("/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const commissions = await Commission.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, data: commissions });
  } catch (error) {
    console.error("Fetch User Commission Trends Error:", error);
    res.status(500).json({ message: "Error fetching user commission trends." });
  }
});

module.exports = router;
