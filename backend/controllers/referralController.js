const express = require("express");
const router = express.Router();
const Referral = require("../models/Referral");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Payout = require("../models/Payout");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Generate a Unique Referral Link
router.post("/generate", verifyToken, async (req, res) => {
  try {
    const referralCode = `${req.user.id}-${Date.now()}`;
    const newReferral = new Referral({
      userId: req.user.id,
      referralCode,
    });

    await newReferral.save();
    res.json({ success: true, referralCode });
  } catch (error) {
    console.error("Referral Code Generation Error:", error);
    res.status(500).json({ message: "Error generating referral code." });
  }
});

// ✅ Track Referrals (View All Referrals Made by a User)
router.get("/my-referrals", verifyToken, async (req, res) => {
  try {
    const referrals = await Referral.find({ userId: req.user.id }).populate("referredUserId", "name email");

    res.json({ success: true, data: referrals });
  } catch (error) {
    console.error("Fetch Referrals Error:", error);
    res.status(500).json({ message: "Error fetching referral data." });
  }
});

// ✅ Referral Registration (User Uses a Referral Code)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let referredBy = null;

    if (referralCode) {
      const referral = await Referral.findOne({ referralCode });

      if (referral) {
        referredBy = referral.userId;
      }
    }

    const newUser = new User({
      name,
      email,
      password,
      referredBy,
    });

    await newUser.save();

    if (referredBy) {
      const referralEntry = await Referral.findOne({ referralCode });
      referralEntry.referredUserId = newUser._id;
      referralEntry.status = "completed";
      await referralEntry.save();
    }

    res.json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("Referral Registration Error:", error);
    res.status(500).json({ message: "Error registering with referral." });
  }
});

// ✅ Get Referral Sales & Transactions
router.get("/transactions", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ referredBy: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Referral Transactions Error:", error);
    res.status(500).json({ message: "Error fetching transactions." });
  }
});

// ✅ Referral Bonus Payout Requests
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
    res.json({ success: true, message: "Referral payout request submitted." });
  } catch (error) {
    console.error("Referral Payout Request Error:", error);
    res.status(500).json({ message: "Error requesting payout." });
  }
});

module.exports = router;
