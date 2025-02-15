const express = require("express");
const router = express.Router();
const AuditLog = require("../models/AuditLog");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Log an Action (Automatic Logging for Key Changes)
const logAction = async (userId, actionType, details) => {
  try {
    const logEntry = new AuditLog({
      userId,
      actionType,
      details,
    });
    await logEntry.save();
  } catch (error) {
    console.error("Audit Log Error:", error);
  }
};

// ✅ Get All Audit Logs (Admin Only)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find().populate("userId", "name email").sort({ createdAt: -1 });

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error("Fetch Audit Logs Error:", error);
    res.status(500).json({ message: "Error fetching audit logs." });
  }
});

// ✅ Get Logs for a Specific User (Admin Only)
router.get("/user/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find({ userId: req.params.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error("Fetch User Audit Logs Error:", error);
    res.status(500).json({ message: "Error fetching audit logs for user." });
  }
});

// ✅ Delete Old Logs (Admin Only)
router.delete("/delete-old", verifyToken, isAdmin, async (req, res) => {
  try {
    const { days } = req.body;
    if (!days) return res.status(400).json({ message: "Days parameter is required." });

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    await AuditLog.deleteMany({ createdAt: { $lt: dateThreshold } });

    res.json({ success: true, message: `Audit logs older than ${days} days deleted.` });
  } catch (error) {
    console.error("Delete Old Audit Logs Error:", error);
    res.status(500).json({ message: "Error deleting old audit logs." });
  }
});

module.exports = { router, logAction };
