// controllers/aiInvoiceAutomationController.js
const AIInvoiceAutomation = require("../models/AIInvoiceAutomation");

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await AIInvoiceAutomation.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching AI invoice data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { customer, amount, dueDate } = req.body;
    const newInvoice = new AIInvoiceAutomation({ customer, amount, dueDate, status: "Pending" });
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
