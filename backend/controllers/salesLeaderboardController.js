const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Get Sales Leaderboard (Daily, Weekly, Monthly, Yearly)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { timeframe } = req.query;

    let matchCondition = {};
    let groupBy = { userId: "$userId" };

    if (timeframe === "daily") {
      matchCondition.createdAt = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
    } else if (timeframe === "weekly") {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      matchCondition.createdAt = { $gte: startOfWeek };
    } else if (timeframe === "monthly") {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      matchCondition.createdAt = { $gte: startOfMonth };
    } else if (timeframe === "yearly") {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      matchCondition.createdAt = { $gte: startOfYear };
    }

    const leaderboard = await Transaction.aggregate([
      { $match: matchCondition },
      { $group: { _id: groupBy, totalSales: { $sum: "$amount" } } },
      { $sort: { totalSales: -1 } },
      { $limit: 10 }, // Get top 10 performers
      {
        $lookup: {
          from: "users",
          localField: "_id.userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          name: "$userDetails.name",
          email: "$userDetails.email",
          role: "$userDetails.role",
          totalSales: 1,
        },
      },
    ]);

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error("Sales Leaderboard Error:", error);
    res.status(500).json({ message: "Error fetching sales leaderboard." });
  }
});

// ✅ Get Individual User's Rank
router.get("/user-rank", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const leaderboard = await Transaction.aggregate([
      { $group: { _id: "$userId", totalSales: { $sum: "$amount" } } },
      { $sort: { totalSales: -1 } },
      {
        $group: {
          _id: null,
          users: { $push: { userId: "$_id", totalSales: "$totalSales" } },
        },
      },
      { $unwind: "$users" },
      {
        $group: {
          _id: "$users.userId",
          rank: { $first: { $sum: 1 } },
          totalSales: { $first: "$users.totalSales" },
        },
      },
      { $match: { _id: userId } },
    ]);

    res.json({ success: true, data: leaderboard.length ? leaderboard[0] : null });
  } catch (error) {
    console.error("User Rank Fetch Error:", error);
    res.status(500).json({ message: "Error fetching user rank." });
  }
});

module.exports = router;
