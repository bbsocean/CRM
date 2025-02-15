const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Commission = require("../models/Commission");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Get User Growth Statistics
router.get("/growth", verifyToken, isAdmin, async (req, res) => {
  try {
    const userStats = await User.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);

    res.json({ success: true, data: userStats });
  } catch (error) {
    console.error("User Growth Error:", error);
    res.status(500).json({ message: "Error fetching user growth statistics." });
  }
});

// ✅ Get Active Users (Users with Transactions)
router.get("/active-users", verifyToken, isAdmin, async (req, res) => {
  try {
    const activeUsers = await Transaction.distinct("userId");
    const users = await User.find({ _id: { $in: activeUsers } }).select("name email role");

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Active Users Fetch Error:", error);
    res.status(500).json({ message: "Error fetching active users." });
  }
});

// ✅ Get Commission Earnings per User
router.get("/commissions", verifyToken, isAdmin, async (req, res) => {
  try {
    const earnings = await Commission.aggregate([
      { $group: { _id: "$userId", totalEarnings: { $sum: "$commissionAmount" } } },
      { $sort: { totalEarnings: -1 } },
    ]);

    res.json({ success: true, data: earnings });
  } catch (error) {
    console.error("User Commission Earnings Error:", error);
    res.status(500).json({ message: "Error fetching user commission earnings." });
  }
});

// ✅ Get User Retention Data (Users Active in Last 3 Months)
router.get("/retention", verifyToken, isAdmin, async (req, res) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const retainedUsers = await User.find({ lastLogin: { $gte: threeMonthsAgo } }).select("name email role");

    res.json({ success: true, data: retainedUsers });
  } catch (error) {
    console.error("User Retention Error:", error);
    res.status(500).json({ message: "Error fetching user retention data." });
  }
});

module.exports = router;
