const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Payout = require("../models/Payout");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Get User Self-Service Dashboard Data
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Fetch user details
    const user = await User.findById(userId).select("-password");
    
    // Fetch user transactions
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    // Fetch payout requests
    const payouts = await Payout.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, data: { user, transactions, payouts } });
  } catch (error) {
    console.error("Self-Service Dashboard Error:", error);
    res.status(500).json({ message: "Error fetching self-service dashboard data." });
  }
});

// ✅ Update User Profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ✅ Request Payout
router.post("/payout-request", verifyToken, async (req, res) => {
  try {
    const { amount, method } = req.body;
    
    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" });
    }

    const payout = new Payout({
      userId: req.user.id,
      amount,
      method,
      status: "pending",
    });

    await payout.save();
    res.json({ success: true, message: "Payout request submitted." });
  } catch (error) {
    console.error("Payout Request Error:", error);
    res.status(500).json({ message: "Error requesting payout" });
  }
});

// ✅ Get User Transactions (Sales, Commissions, Payouts)
router.get("/transactions", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Transaction Fetch Error:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

module.exports = router;
