// controllers/automatedCustomerSupportAIController.js
const axios = require("axios");

exports.getAIResponse = async (req, res) => {
  try {
    const { query } = req.body;

    // Simulating AI response with a mock API or integrating with an NLP AI service
    const aiResponse = await axios.post("https://api.example-ai.com/chatbot", { question: query });

    res.status(200).json({ answer: aiResponse.data.answer || "Sorry, I don't understand that question yet." });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
