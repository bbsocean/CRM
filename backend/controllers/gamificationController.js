const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");
const { calculateLeaderboard } = require("../utils/leaderboardUtils");

// ✅ Fetch Leaderboard (Daily, Weekly, Monthly, Yearly, or Custom Range)
router.get("/leaderboard", verifyToken, async (req, res) => {
  try {
    const { period = "monthly", startDate, endDate } = req.query; // Default: Monthly
    const leaderboardData = await calculateLeaderboard(period, startDate, endDate);

    res.json({ success: true, data: leaderboardData });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ message: "Error fetching leaderboard rankings." });
  }
});

module.exports = router;
