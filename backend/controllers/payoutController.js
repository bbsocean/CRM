const Sale = require('../models/Sale');
const Commission = require('../models/Commission');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const express = require("express");
const router = express.Router();
const Payout = require("../models/Payout");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { processPayouts } = require("../utils/payoutUtils");

exports.createSale = async (req, res) => {
  try {
    const { productName, saleAmount, customerId, agentId } = req.body;

    // Create the sale record
    const newSale = await Sale.create({ productName, saleAmount, customerId, agentId });

    // Fetch the agent and their territory head/franchisee relationships
    const agent = await User.findById(agentId);
    const territoryHead = await User.findById(agent.assignedTo);  // Assuming assignedTo points to territory head
    const franchisee = await User.findById(territoryHead?.assignedTo);

    // Calculate and create commissions
    const commissions = [];

    // Agent commission
    const agentCommission = (saleAmount * 0.10);  // Example 10% rate
    commissions.push(await Commission.create({
      saleId: newSale._id,
      recipientId: agentId,
      amount: agentCommission,
      status: 'Pending'
    }));

    // Territory head commission (if applicable)
    if (territoryHead) {
      const territoryCommission = (saleAmount * 0.05);  // Example 5% rate
      commissions.push(await Commission.create({
        saleId: newSale._id,
        recipientId: territoryHead._id,
        amount: territoryCommission,
        status: 'Pending'
      }));
    }

    // Franchisee commission (if applicable)
    if (franchisee) {
      const franchiseCommission = (saleAmount * 0.03);  // Example 3% rate
      commissions.push(await Commission.create({
        saleId: newSale._id,
        recipientId: franchisee._id,
        amount: franchiseCommission,
        status: 'Pending'
      }));
    }
    res.status(201).json({ message: 'Sale created and commissions calculated', commissions });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }

  
// ✅ Create a new payout after verifying the commission hasn't been paid
exports.createPayout = async (req, res) => {
  const { recipientId, commissionId, amount, paymentMethod } = req.body;

  try {
    // Step 1: Check if a transaction for this commissionId already exists
    const existingTransaction = await Transaction.findOne({ commissionId });
    if (existingTransaction) {
      return res.status(400).json({
        message: 'Payout for this commission has already been processed.',
      });
    }

    // Step 2: Create a new transaction
    const newTransaction = new Transaction({
      recipientId,
      commissionId,
      amount,
      paymentMethod,
      status: 'Pending',  // Initially pending
    });

    await newTransaction.save();

    // Step 3: Mark commission as paid
    await Commission.findByIdAndUpdate(commissionId, { status: 'Paid' });

    res.status(201).json({
      message: 'Payout created successfully.',
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

};

//------------------------------------------------------------
exports.processPayout = async (req, res) => {
  try {
    const { amount, recipientId, paymentMethod } = req.body;

    // Placeholder logic for processing payout
    console.log(`Processing payout of ${amount} to recipient ${recipientId} via ${paymentMethod}`);
    
    // Respond back
    res.status(200).json({ message: 'Payout processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payout', error });
  }
};

// ✅ Fetch Payouts (Filter by status & timeframe)
router.get("/", verifyToken, async (req, res) => {
  try {
    const { status = "pending", period = "monthly" } = req.query;

    const payouts = await Payout.find({ status }).sort({ date: -1 });
    
    res.json({ success: true, data: payouts });
  } catch (error) {
    console.error("Payout Error:", error);
    res.status(500).json({ message: "Error fetching payouts." });
  }
});

// ✅ Request a Payout (User Request)
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { userId, amount, method } = req.body;

    if (!userId || !amount || !method) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPayout = new Payout({
      userId,
      amount,
      method,
      status: "pending",
    });

    await newPayout.save();
    res.json({ success: true, message: "Payout request submitted." });
  } catch (error) {
    console.error("Payout Request Error:", error);
    res.status(500).json({ message: "Error requesting payout." });
  }
});
// ✅ Get User Payout History
router.get("/history", verifyToken, async (req, res) => {
  try {
    const payouts = await Payout.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: payouts });
  } catch (error) {
    console.error("Fetch Payout History Error:", error);
    res.status(500).json({ message: "Error fetching payout history." });
  }
});

// ✅ Admin: Get All Payout Requests
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const payouts = await Payout.find().populate("userId", "name email").sort({ createdAt: -1 });

    res.json({ success: true, data: payouts });
  } catch (error) {
    console.error("Fetch All Payout Requests Error:", error);
    res.status(500).json({ message: "Error fetching payout requests." });
  }
});

// ✅ Admin: Approve/Reject Payout
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "paid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    const payout = await Payout.findById(req.params.id);

    if (!payout) return res.status(404).json({ message: "Payout request not found" });

    payout.status = status;
    await payout.save();

    res.json({ success: true, message: `Payout request marked as ${status}.` });
  } catch (error) {
    console.error("Payout Status Update Error:", error);
    res.status(500).json({ message: "Error updating payout status." });
  }
});

// ✅ Approve Payout (Admin Action)
router.put("/approve/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) return res.status(404).json({ message: "Payout not found" });

    payout.status = "approved";
    await payout.save();

    res.json({ success: true, message: "Payout approved." });
  } catch (error) {
    console.error("Approve Payout Error:", error);
    res.status(500).json({ message: "Error approving payout." });
  }
});

// ✅ Process Payout (Move to completed)
router.post("/process", verifyToken, isAdmin, async (req, res) => {
  try {
    const processed = await processPayouts();
    res.json({ success: true, message: "Payouts processed successfully.", data: processed });
  } catch (error) {
    console.error("Process Payout Error:", error);
    res.status(500).json({ message: "Error processing payouts." });
  }
});

module.exports = router;