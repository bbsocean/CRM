// controllers/aiVoiceAssistantController.js
const AIVoiceAssistant = require("../models/AIVoiceAssistant");

exports.getVoiceResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const aiResponse = await AIVoiceAssistant.generateResponse(message);
    res.status(200).json({ reply: aiResponse });
  } catch (error) {
    console.error("Error fetching AI voice assistant response:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
