const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Commission = require('../models/Commission');
const { createPayout } = require('../controllers/payoutController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { processPayout } = require('../controllers/payoutController');

const router = express.Router();


// check: Secure POST: Process payouts (Agents, Franchisees, Admins) 
router.post(
   '/create', 
   verifyToken, 
   authorizeRoles('Admin', 'Agent', 'Franchisee','Finance' ),
    processPayout 
  );

// Create a transaction and mark commission as paid
router.post('/create', async (req, res) => {
  try {
    const {
      recipientId,
      commissionId,
      amount,
      paymentMethod,
      paymentReference,
      bankDetails
    } = req.body;

      //-------
      router.post('/create', verifyToken, authorizeRoles('Admin'), createPayout);
      //-------


    // Convert IDs to ObjectId type
    const convertedCommissionId = mongoose.Types.ObjectId(commissionId);
    const convertedRecipientId = mongoose.Types.ObjectId(recipientId);

    // Create a new transaction
    const newTransaction = new Transaction({
      recipientId: convertedRecipientId,
      commissionId: convertedCommissionId,
      amount,
      currency: 'INR',
      paymentMethod,
      paymentReference: paymentReference || 'N/A',
      bankDetails: bankDetails || {},
      status: 'Completed',
      payoutDate: new Date()
    });

    await newTransaction.save();

    // Update the commission status to 'Paid'
    await Commission.findByIdAndUpdate(convertedCommissionId, { status: 'Paid' });

    res.status(201).json({
      message: 'Transaction completed and commission marked as paid',
      transaction: newTransaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

module.exports = router;
