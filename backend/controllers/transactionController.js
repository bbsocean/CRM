// backend/controllers/transactionController.js

const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Record a New Transaction
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { type, amount, userId, referenceId, status, commissionEarned } = req.body;

    if (!type || !amount || !userId) {
      return res.status(400).json({ message: "Type, amount, and userId are required" });
    }

    const newTransaction = new Transaction({
      type,
      amount,
      userId,
      referenceId,
      status: status || "pending",
      commissionEarned: commissionEarned || 0,
    });

    await newTransaction.save();
    res.json({ success: true, message: "Transaction recorded successfully." });
  } catch (error) {
    console.error("Transaction Creation Error:", error);
    res.status(500).json({ message: "Error recording transaction." });
  }
});

// ✅ Get All Transactions (Admin Only)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("userId", "name email").sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Fetch All Transactions Error:", error);
    res.status(500).json({ message: "Error fetching transactions." });
  }
});
// ✅ Get Transactions by User ID
router.get("/user", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Fetch User Transactions Error:", error);
    res.status(500).json({ message: "Error fetching transactions." });
  }
});
// ✅ Get Transaction by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate("userId", "name email");

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ success: true, data: transaction });
  } catch (error) {
    console.error("Fetch Transaction Error:", error);
    res.status(500).json({ message: "Error fetching transaction details." });
  }
});

// ✅ Update Transaction Status (Admin Only)
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "completed", "failed", "refunded"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    transaction.status = status;
    await transaction.save();

    res.json({ success: true, message: `Transaction updated to ${status}.` });
  } catch (error) {
    console.error("Transaction Update Error:", error);
    res.status(500).json({ message: "Error updating transaction." });
  }
});

// ✅ Delete Transaction (Admin Only)
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Transaction deleted successfully." });
  } catch (error) {
    console.error("Delete Transaction Error:", error);
    res.status(500).json({ message: "Error deleting transaction." });
  }
});

// GET all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('customer', 'name email phone')
      .sort({ date: -1 }); // Sorting by most recent transactions
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// GET a specific transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate('customer', 'name email');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
};

// POST a new transaction
const createTransaction = async (req, res) => {
  const { customer, amount, status } = req.body;

  try {
    // Check if the customer exists
    const customerExists = await Customer.findById(customer);
    if (!customerExists) {
      return res.status(404).json({ message: 'Assigned customer not found' });
    }

    // Create a new transaction
    const newTransaction = new Transaction({
      customer,
      amount,
      status: status || 'Pending',
    });

    const savedTransaction = await newTransaction.save();

    // Link the transaction to the customer
    customerExists.transactions.push(savedTransaction._id);
    await customerExists.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

// PUT to update an existing transaction
const updateTransaction = async (req, res) => {
  const { amount, status } = req.body;

  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update transaction details
    transaction.amount = amount || transaction.amount;
    transaction.status = status || transaction.status;

    const updatedTransaction = await transaction.save();
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error: error.message });
  }
};

// DELETE a transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Remove the transaction from the customer's transaction list
    await Customer.updateOne(
      { _id: transaction.customer },
      { $pull: { transactions: transaction._id } }
    );

    await transaction.remove();
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
