// controllers/aiAuditComplianceController.js
const AIAuditCompliance = require("../models/AIAuditCompliance");

exports.getAuditReports = async (req, res) => {
  try {
    const auditReports = await AIAuditCompliance.find();
    res.status(200).json(auditReports);
  } catch (error) {
    console.error("Error fetching AI audit compliance reports:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.initiateAudit = async (req, res) => {
  try {
    await AIAuditCompliance.updateMany({}, { $set: { status: "Audit in Progress" } });
    res.status(200).json({ message: "AI Audit & Compliance Check initiated successfully!" });
  } catch (error) {
    console.error("Error initiating audit:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
