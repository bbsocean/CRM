const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");

// ✅ Allow Customer to Apply as a Vendor
router.post("/apply", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.role = "Vendor";
    await user.save();

    res.json({ success: true, message: "Your application to become a vendor is under review." });
  } catch (error) {
    console.error("Customer Become Vendor Error:", error);
    res.status(500).json({ message: "Error applying to become a vendor." });
  }
});

module.exports = router;
