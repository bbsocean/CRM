// controllers/aiLoadBalancerController.js
const AILoadBalancer = require("../models/AILoadBalancer");

exports.getLoadMetrics = async (req, res) => {
  try {
    const loadMetrics = await AILoadBalancer.find();
    res.status(200).json(loadMetrics);
  } catch (error) {
    console.error("Error fetching AI load-balancing data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.balanceLoad = async (req, res) => {
  try {
    await AILoadBalancer.updateMany({}, { $set: { loadDistributionStatus: "Optimized" } });
    res.status(200).json({ message: "AI Load Balancing initiated successfully!" });
  } catch (error) {
    console.error("Error balancing load:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
