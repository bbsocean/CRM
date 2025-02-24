const express = require("express");
const router = express.Router();
const ReferralBonus = require("../models/ReferralBonus");
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Create a Referral Bonus Entry (System or Admin Triggered)
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const { referrerId, referredUserId, bonusAmount, status } = req.body;

    if (!referrerId || !referredUserId || !bonusAmount) {
      return res.status(400).json({ message: "Referrer ID, referred user ID, and bonus amount are required." });
    }

    const newBonus = new ReferralBonus({
      referrerId,
      referredUserId,
      bonusAmount,
      status: status || "pending",
    });

    await newBonus.save();
    res.json({ success: true, message: "Referral bonus recorded successfully." });
  } catch (error) {
    console.error("Referral Bonus Creation Error:", error);
    res.status(500).json({ message: "Error creating referral bonus." });
  }
});

// ✅ Get All Referral Bonuses (Admin Only)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const bonuses = await ReferralBonus.find()
      .populate("referrerId", "name email")
      .populate("referredUserId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bonuses });
  } catch (error) {
    console.error("Fetch All Referral Bonuses Error:", error);
    res.status(500).json({ message: "Error fetching referral bonuses." });
  }
});

// ✅ Get Referral Bonuses Earned by a User
router.get("/user", verifyToken, async (req, res) => {
  try {
    const bonuses = await ReferralBonus.find({ referrerId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: bonuses });
  } catch (error) {
    console.error("Fetch User Referral Bonuses Error:", error);
    res.status(500).json({ message: "Error fetching referral bonuses for user." });
  }
});

// ✅ Update Referral Bonus Status (Admin Only)
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "paid", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const bonus = await ReferralBonus.findById(req.params.id);

    if (!bonus) return res.status(404).json({ message: "Referral bonus not found." });

    bonus.status = status;
    await bonus.save();

    res.json({ success: true, message: `Referral bonus marked as ${status}.` });
  } catch (error) {
    console.error("Referral Bonus Status Update Error:", error);
    res.status(500).json({ message: "Error updating referral bonus status." });
  }
});

// ✅ Delete Referral Bonus Entry (Admin Only)
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await ReferralBonus.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Referral bonus entry deleted successfully." });
  } catch (error) {
    console.error("Delete Referral Bonus Error:", error);
    res.status(500).json({ message: "Error deleting referral bonus entry." });
  }
});

module.exports = router;
