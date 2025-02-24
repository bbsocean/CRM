// controllers/aiAutoHealingSystemController.js
const AIAutoHealingSystem = require("../models/AIAutoHealingSystem");

exports.getHealingData = async (req, res) => {
  try {
    const healingData = await AIAutoHealingSystem.find();
    res.status(200).json(healingData);
  } catch (error) {
    console.error("Error fetching AI auto-healing data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
