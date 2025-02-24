const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Get Franchise Dashboard Data
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ franchiseId: req.user.id });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Franchise Dashboard Error:", error);
    res.status(500).json({ message: "Error fetching franchise dashboard data." });
  }
});

// ✅ Franchise Self-Service Update Profile
router.put("/update-profile", verifyToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const franchise = await Franchise.findById(req.user.id);

    if (!franchise) return res.status(404).json({ message: "Franchise not found." });

    franchise.name = name || franchise.name;
    franchise.email = email || franchise.email;
    franchise.phone = phone || franchise.phone;

    await franchise.save();
    res.json({ success: true, message: "Franchise profile updated successfully." });
  } catch (error) {
    console.error("Update Franchise Profile Error:", error);
    res.status(500).json({ message: "Error updating franchise profile." });
  }
});

module.exports = router;
