// controllers/aiAutoResourceAllocationController.js
const AIAutoResourceAllocation = require("../models/AIAutoResourceAllocation");

exports.getResourceData = async (req, res) => {
  try {
    const resourceData = await AIAutoResourceAllocation.find();
    res.status(200).json(resourceData);
  } catch (error) {
    console.error("Error fetching AI resource allocation data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.toggleAutoAllocation = async (req, res) => {
  try {
    const { enabled } = req.body;
    await AIAutoResourceAllocation.updateMany({}, { $set: { autoAllocationEnabled: enabled } });
    res.status(200).json({ message: "Auto resource allocation status updated" });
  } catch (error) {
    console.error("Error updating auto resource allocation status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
