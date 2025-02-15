// controllers/automatedLeadGenerationController.js
const AutomatedLead = require("../models/AutomatedLead");

exports.getAutomatedLeads = async (req, res) => {
  try {
    const leads = await AutomatedLead.find();
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching automated leads:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
