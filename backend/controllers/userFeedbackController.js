const express = require("express");
const router = express.Router();
const UserFeedback = require("../models/UserFeedback");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Submit User Feedback
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { category, message, rating } = req.body;

    if (!category || !message) {
      return res.status(400).json({ message: "Category and message are required." });
    }

    const newFeedback = new UserFeedback({
      userId: req.user.id,
      category,
      message,
      rating: rating || 0, // Optional star rating (out of 5)
    });

    await newFeedback.save();
    res.json({ success: true, message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("User Feedback Submission Error:", error);
    res.status(500).json({ message: "Error submitting feedback." });
  }
});

// ✅ Get All Feedback (Admin Only)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const feedbacks = await UserFeedback.find().populate("userId", "name email").sort({ createdAt: -1 });

    res.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("Fetch All User Feedback Error:", error);
    res.status(500).json({ message: "Error fetching user feedback." });
  }
});

// ✅ Get User's Submitted Feedback
router.get("/user", verifyToken, async (req, res) => {
  try {
    const feedbacks = await UserFeedback.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("Fetch User Feedback Error:", error);
    res.status(500).json({ message: "Error fetching user feedback." });
  }
});

// ✅ Delete Feedback (Admin Only)
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await UserFeedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User feedback deleted successfully." });
  } catch (error) {
    console.error("Delete User Feedback Error:", error);
    res.status(500).json({ message: "Error deleting user feedback." });
  }
});

module.exports = router;
