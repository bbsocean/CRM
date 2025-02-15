// backend/controllers/commissionController.js
const express = require("express");
const router = express.Router();
const Commission = require('../models/Commission');
const Transaction = require('../models/Transaction');
const Agent = require('../models/Agent');
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");


// ✅ Record a New Commission Entry
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, transactionId, commissionAmount, role, status } = req.body;

    if (!userId || !transactionId || !commissionAmount || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCommission = new Commission({
      userId,
      transactionId,
      commissionAmount,
      role,
      status: status || "pending",
    });

    await newCommission.save();
    res.json({ success: true, message: "Commission recorded successfully." });
  } catch (error) {
    console.error("Commission Creation Error:", error);
    res.status(500).json({ message: "Error recording commission." });
  }
});

// ✅ Get All Commissions (Admin Only)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const commissions = await Commission.find().populate("userId", "name email").sort({ createdAt: -1 });

    res.json({ success: true, data: commissions });
  } catch (error) {
    console.error("Fetch All Commissions Error:", error);
    res.status(500).json({ message: "Error fetching commissions." });
  }
});

// ✅ Get Commissions by User ID
router.get("/user", verifyToken, async (req, res) => {
  try {
    const commissions = await Commission.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: commissions });
  } catch (error) {
    console.error("Fetch User Commissions Error:", error);
    res.status(500).json({ message: "Error fetching commissions." });
  }
});

// ✅ Get Commission by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id).populate("userId", "name email");

    if (!commission) return res.status(404).json({ message: "Commission not found" });

    res.json({ success: true, data: commission });
  } catch (error) {
    console.error("Fetch Commission Error:", error);
    res.status(500).json({ message: "Error fetching commission details." });
  }
});

// ✅ Update Commission Status (Admin Only)
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "paid", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const commission = await Commission.findById(req.params.id);

    if (!commission) return res.status(404).json({ message: "Commission not found" });

    commission.status = status;
    await commission.save();

    res.json({ success: true, message: `Commission updated to ${status}.` });
  } catch (error) {
    console.error("Commission Update Error:", error);
    res.status(500).json({ message: "Error updating commission." });
  }
});

// ✅ Delete Commission (Admin Only)
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Commission.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Commission deleted successfully." });
  } catch (error) {
    console.error("Delete Commission Error:", error);
    res.status(500).json({ message: "Error deleting commission." });
  }
});

module.exports = router;
//------------------------------------------------------------------

const getDynamicCommissionRate = async (agentId) => {
  // Example: Fetch rate based on agent ID or predefined category
  return 0.10; // Default to 10% for now or dynamically fetch from DB
};

// Helper function to calculate commission based on the transaction amount
const calculateCommissionAmount = (amount) => {
  const commissionRate = 0.10; // Example: 10% commission
  return amount * commissionRate;
};

// GET all commissions
const getAllCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find()
      .populate('agent', 'name email')
      .populate('transaction', 'amount date');
    res.status(200).json(commissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commissions', error: error.message });
  }
};

// GET a specific commission by ID
const getCommissionById = async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id)
      .populate('agent', 'name email')
      .populate('transaction', 'amount date');
    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }
    res.status(200).json(commission);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commission', error: error.message });
  }
};

// POST a new commission manually
const createCommission = async (req, res) => {
  const { agent, transaction, amount } = req.body;

  try {
    // Check if the agent and transaction exist
    const agentExists = await Agent.findById(agent);
    const transactionExists = await Transaction.findById(transaction);

    if (!agentExists) {
      return res.status(404).json({ message: 'Assigned agent not found' });
    }
    if (!transactionExists) {
      return res.status(404).json({ message: 'Associated transaction not found' });
    }

    // Create a new commission entry
    const newCommission = new Commission({
      agent,
      transaction,
      amount,
    });

    const savedCommission = await newCommission.save();
    res.status(201).json(savedCommission);
  } catch (error) {
    res.status(500).json({ message: 'Error creating commission', error: error.message });
  }
};

// PUT to update an existing commission
const updateCommission = async (req, res) => {
  const { amount } = req.body;

  try {
    const commission = await Commission.findById(req.params.id);
    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    // Update the commission amount if provided
    commission.amount = amount || commission.amount;

    const updatedCommission = await commission.save();
    res.status(200).json(updatedCommission);
  } catch (error) {
    res.status(500).json({ message: 'Error updating commission', error: error.message });
  }
};

// DELETE a commission
const deleteCommission = async (req, res) => {
  try {
    const commission = await Commission.findById(req.params.id);
    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    await commission.remove();
    res.status(200).json({ message: 'Commission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting commission', error: error.message });
  }
};

// POST to calculate commission automatically for a given transaction
const calculateCommissionForTransaction = async (req, res) => {
  const { transactionId, agentId } = req.body;

  try {
    // Check if the agent and transaction exist
    const agentExists = await Agent.findById(agentId);
    const transactionExists = await Transaction.findById(transactionId);

    if (!agentExists) {
      return res.status(404).json({ message: 'Assigned agent not found' });
    }
    if (!transactionExists) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Calculate commission amount based on transaction
    const commissionAmount = calculateCommissionAmount(transactionExists.amount);

    // Create a new commission entry
    const newCommission = new Commission({
      agent: agentId,
      transaction: transactionId,
      amount: commissionAmount,
    });

    const savedCommission = await newCommission.save();
    res.status(201).json({
      message: 'Commission calculated and saved successfully',
      commission: savedCommission,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating commission', error: error.message });
  }
};

module.exports = {
  getAllCommissions,
  getCommissionById,
  createCommission,
  updateCommission,
  deleteCommission,
  calculateCommissionForTransaction,
};
