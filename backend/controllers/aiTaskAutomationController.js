// controllers/aiTaskAutomationController.js
const AITaskAutomation = require("../models/AITaskAutomation");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await AITaskAutomation.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching AI tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { name, type, status } = req.body;
    const newTask = new AITaskAutomation({ name, type, status });
    await newTask.save();
    res.status(201).json({ message: "New AI Task Created Successfully!" });
  } catch (error) {
    console.error("Error creating AI task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
