// controllers/aiSecurityAuditLogsController.js
const AISecurityAuditLogs = require("../models/AISecurityAuditLogs");

exports.getAuditLogs = async (req, res) => {
  try {
    const { filter } = req.query;
    let logs;

    if (filter === "Login Attempts") {
      logs = await AISecurityAuditLogs.find({ category: "Login Attempt" });
    } else if (filter === "Unauthorized Access") {
      logs = await AISecurityAuditLogs.find({ category: "Unauthorized Access" });
    } else if (filter === "Data Modifications") {
      logs = await AISecurityAuditLogs.find({ category: "Data Modification" });
    } else {
      logs = await AISecurityAuditLogs.find();
    }

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching AI security audit logs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
