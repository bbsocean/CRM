// controllers/escrowPaymentsController.js
const EscrowPayment = require("../models/EscrowPayment");

exports.getEscrowPayments = async (req, res) => {
  try {
    const transactions = await EscrowPayment.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching escrow transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
