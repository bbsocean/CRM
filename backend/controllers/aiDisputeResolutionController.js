// controllers/aiDisputeResolutionController.js
const AIDisputeResolution = require("../models/AIDisputeResolution");

exports.getDisputes = async (req, res) => {
  try {
    const disputes = await AIDisputeResolution.find();
    res.status(200).json(disputes);
  } catch (error) {
    console.error("Error fetching AI dispute cases:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createDispute = async (req, res) => {
  try {
    const { user, transactionId, reason } = req.body;
    const newDispute = new AIDisputeResolution({ user, transactionId, reason, status: "Pending" });
    await newDispute.save();
    res.status(201).json(newDispute);
  } catch (error) {
    console.error("Error creating dispute:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
