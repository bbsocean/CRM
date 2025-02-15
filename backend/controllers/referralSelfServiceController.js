const express = require("express");
const router = express.Router();
const Referral = require("../models/Referral");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Get User Referral Data
router.get("/referrals", verifyToken, async (req, res) => {
  try {
    const referrals = await Referral.find({ referrerId: req.user.id });

    res.json({ success: true, data: referrals });
  } catch (error) {
    console.error("Fetch User Referrals Error:", error);
    res.status(500).json({ message: "Error fetching referral data." });
  }
});

module.exports = router;
