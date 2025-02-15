// controllers/aiCustomerRetentionController.js
const AICustomerRetention = require("../models/AICustomerRetention");

exports.getCustomerRetention = async (req, res) => {
  try {
    const customers = await AICustomerRetention.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching AI customer retention data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
