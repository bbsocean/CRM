const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");
const { calculatePerformance } = require("../utils/performanceUtils");

// ✅ Fetch Performance Data (Daily, Weekly, Monthly, Yearly)
router.get("/track", verifyToken, async (req, res) => {
  try {
    const { userId, period = "monthly" } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const performanceData = await calculatePerformance(userId, period);
    
    res.json({ success: true, data: performanceData });
  } catch (error) {
    console.error("Performance Tracking Error:", error);
    res.status(500).json({ message: "Error fetching performance data." });
  }
});

module.exports = router;
