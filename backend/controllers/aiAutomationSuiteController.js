// controllers/aiAutomationSuiteController.js
const AIAutomationSuite = require("../models/AIAutomationSuite");

exports.getAutomations = async (req, res) => {
  try {
    const automations = await AIAutomationSuite.find();
    res.status(200).json(automations);
  } catch (error) {
    console.error("Error fetching AI automation processes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createAutomation = async (req, res) => {
  try {
    const { name, type, status } = req.body;
    const newAutomation = new AIAutomationSuite({ name, type, status });
    await newAutomation.save();
    res.status(201).json({ message: "New AI Automation Created Successfully!" });
  } catch (error) {
    console.error("Error creating automation process:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
