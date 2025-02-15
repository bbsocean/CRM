const express = require("express");
const router = express.Router();
const SupportTicket = require("../models/SupportTicket");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Create a New Support Ticket
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { subject, message, priority } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required." });
    }

    const newTicket = new SupportTicket({
      userId: req.user.id,
      subject,
      message,
      priority: priority || "normal",
      status: "open",
    });

    await newTicket.save();
    res.json({ success: true, message: "Support ticket created successfully." });
  } catch (error) {
    console.error("Support Ticket Creation Error:", error);
    res.status(500).json({ message: "Error creating support ticket." });
  }
});

// ✅ Get All Support Tickets (Admin Only)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().populate("userId", "name email").sort({ createdAt: -1 });

    res.json({ success: true, data: tickets });
  } catch (error) {
    console.error("Fetch All Support Tickets Error:", error);
    res.status(500).json({ message: "Error fetching support tickets." });
  }
});

// ✅ Get User's Support Tickets
router.get("/user", verifyToken, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: tickets });
  } catch (error) {
    console.error("Fetch User Support Tickets Error:", error);
    res.status(500).json({ message: "Error fetching user support tickets." });
  }
});

// ✅ Update Ticket Status (Admin Only)
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, responseMessage } = req.body;

    if (!["open", "in progress", "resolved", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) return res.status(404).json({ message: "Support ticket not found." });

    ticket.status = status;
    if (responseMessage) {
      ticket.responseMessage = responseMessage;
      ticket.respondedAt = new Date();
    }

    await ticket.save();

    res.json({ success: true, message: `Support ticket marked as ${status}.` });
  } catch (error) {
    console.error("Support Ticket Status Update Error:", error);
    res.status(500).json({ message: "Error updating support ticket status." });
  }
});

// ✅ Delete a Support Ticket (Admin Only)
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await SupportTicket.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Support ticket deleted successfully." });
  } catch (error) {
    console.error("Delete Support Ticket Error:", error);
    res.status(500).json({ message: "Error deleting support ticket." });
  }
});

module.exports = router;
