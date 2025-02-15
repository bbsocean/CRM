// controllers/dashboardController.js
const Dashboard = require("../models/Dashboard");

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Dashboard.findOne(); // Fetch latest stats
    if (!stats) return res.status(404).json({ message: "No data found" });

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
