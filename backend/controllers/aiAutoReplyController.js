// controllers/aiAutoReplyController.js
const AIAutoReply = require("../models/AIAutoReply");

exports.getAutoReply = async (req, res) => {
  try {
    const { message } = req.body;
    const aiResponse = await AIAutoReply.generateReply(message);
    res.status(200).json({ reply: aiResponse });
  } catch (error) {
    console.error("Error fetching AI auto-reply:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
