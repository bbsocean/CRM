const express = require("express");
const router = express.Router();
const CommissionPayout = require("../models/CommissionPayout");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Request Commission Payout
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" });
    }

    const newPayout = new CommissionPayout({
      userId: req.user.id,
      amount,
      method,
      status: "pending",
    });

    await newPayout.save();
    res.json({ success: true, message: "Commission payout request submitted successfully." });
  } catch (error) {
    console.error("Commission Payout Request Error:", error);
    res.status(500).json({ message: "Error submitting commission payout request." });
  }
});

// ✅ Get User Payout History
router.get("/history", verifyToken, async (req, res) => {
  try {
    const payouts = await CommissionPayout.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: payouts });
  } catch (error) {
    console.error("Fetch Commission Payout History Error:", error);
    res.status(500).json({ message: "Error fetching commission payout history." });
  }
});

// ✅ Admin: Get All Commission Payout Requests
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const payouts = await CommissionPayout.find().populate("userId", "name email").sort({ createdAt: -1 });

    res.json({ success: true, data: payouts });
  } catch (error) {
    console.error("Fetch All Commission Payout Requests Error:", error);
    res.status(500).json({ message: "Error fetching commission payout requests." });
  }
});

// ✅ Admin: Approve/Reject Commission Payout
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected", "paid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const payout = await CommissionPayout.findById(req.params.id);

    if (!payout) return res.status(404).json({ message: "Payout request not found" });

    payout.status = status;
    await payout.save();

    res.json({ success: true, message: `Payout request marked as ${status}.` });
  } catch (error) {
    console.error("Commission Payout Status Update Error:", error);
    res.status(500).json({ message: "Error updating payout status." });
  }
});

module.exports = router;
