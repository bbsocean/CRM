const express = require("express");
const router = express.Router();
const BonusReward = require("../models/BonusReward");
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Create a Bonus Reward (Admin Only)
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, bonusAmount, reason, status } = req.body;

    if (!userId || !bonusAmount || !reason) {
      return res.status(400).json({ message: "User ID, bonus amount, and reason are required" });
    }

    const newBonus = new BonusReward({
      userId,
      bonusAmount,
      reason,
      status: status || "pending",
    });

    await newBonus.save();
    res.json({ success: true, message: "Bonus reward created successfully." });
  } catch (error) {
    console.error("Bonus Reward Creation Error:", error);
    res.status(500).json({ message: "Error creating bonus reward." });
  }
});

// ✅ Get All Bonus Rewards (Admin Only)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const bonuses = await BonusReward.find().populate("userId", "name email").sort({ createdAt: -1 });

    res.json({ success: true, data: bonuses });
  } catch (error) {
    console.error("Fetch All Bonus Rewards Error:", error);
    res.status(500).json({ message: "Error fetching bonus rewards." });
  }
});

// ✅ Get Bonus Rewards by User ID
router.get("/user", verifyToken, async (req, res) => {
  try {
    const bonuses = await BonusReward.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: bonuses });
  } catch (error) {
    console.error("Fetch User Bonus Rewards Error:", error);
    res.status(500).json({ message: "Error fetching user bonus rewards." });
  }
});

// ✅ Update Bonus Reward Status (Admin Only)
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "paid", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const bonus = await BonusReward.findById(req.params.id);

    if (!bonus) return res.status(404).json({ message: "Bonus reward not found" });

    bonus.status = status;
    await bonus.save();

    res.json({ success: true, message: `Bonus reward marked as ${status}.` });
  } catch (error) {
    console.error("Bonus Reward Status Update Error:", error);
    res.status(500).json({ message: "Error updating bonus reward status." });
  }
});

// ✅ Delete Bonus Reward (Admin Only)
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await BonusReward.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Bonus reward deleted successfully." });
  } catch (error) {
    console.error("Delete Bonus Reward Error:", error);
    res.status(500).json({ message: "Error deleting bonus reward." });
  }
});

module.exports = router;
