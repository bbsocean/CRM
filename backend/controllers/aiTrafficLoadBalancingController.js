// controllers/aiTrafficLoadBalancingController.js
const AITrafficLoadBalancing = require("../models/AITrafficLoadBalancing");

exports.getTrafficData = async (req, res) => {
  try {
    const trafficData = await AITrafficLoadBalancing.find();
    res.status(200).json(trafficData);
  } catch (error) {
    console.error("Error fetching AI traffic load balancing data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
