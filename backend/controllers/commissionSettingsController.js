const express = require("express");
const router = express.Router();
const CommissionSetting = require("../models/CommissionSetting");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Create or Update Commission Settings for a Role
router.post("/update", verifyToken, isAdmin, async (req, res) => {
  try {
    const { role, commissionRate, minThreshold, maxThreshold } = req.body;

    if (!role || !commissionRate) {
      return res.status(400).json({ message: "Role and commission rate are required." });
    }

    let setting = await CommissionSetting.findOne({ role });

    if (setting) {
      setting.commissionRate = commissionRate;
      setting.minThreshold = minThreshold || setting.minThreshold;
      setting.maxThreshold = maxThreshold || setting.maxThreshold;
    } else {
      setting = new CommissionSetting({ role, commissionRate, minThreshold, maxThreshold });
    }

    await setting.save();
    res.json({ success: true, message: "Commission settings updated successfully.", data: setting });
  } catch (error) {
    console.error("Commission Settings Update Error:", error);
    res.status(500).json({ message: "Error updating commission settings." });
  }
});

// ✅ Get All Commission Settings
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const settings = await CommissionSetting.find();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error("Fetch Commission Settings Error:", error);
    res.status(500).json({ message: "Error fetching commission settings." });
  }
});

// ✅ Get Commission Settings for a Specific Role
router.get("/:role", verifyToken, async (req, res) => {
  try {
    const setting = await CommissionSetting.findOne({ role: req.params.role });

    if (!setting) return res.status(404).json({ message: "No commission settings found for this role." });

    res.json({ success: true, data: setting });
  } catch (error) {
    console.error("Fetch Role Commission Settings Error:", error);
    res.status(500).json({ message: "Error fetching commission settings for the role." });
  }
});

// ✅ Delete Commission Setting for a Role
router.delete("/delete/:role", verifyToken, isAdmin, async (req, res) => {
  try {
    await CommissionSetting.findOneAndDelete({ role: req.params.role });
    res.json({ success: true, message: "Commission setting deleted successfully." });
  } catch (error) {
    console.error("Delete Commission Setting Error:", error);
    res.status(500).json({ message: "Error deleting commission setting." });
  }
});

module.exports = router;
