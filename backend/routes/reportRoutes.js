const express = require('express');
const Sale = require('../models/Sale');
const Commission = require('../models/Commission');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Sales Report
router.get('/sales', async (req, res) => {
  try {
    const sales = await Sale.find().populate('agentId customerId', 'name email');
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales report', error });
  }
});

// Commission Report
router.get('/commissions', async (req, res) => {
  try {
    const commissions = await Commission.find().populate('saleId agentId', 'productName commissionAmount');
    res.status(200).json(commissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commissions report', error });
  }
});

// Transaction Report
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('recipientId commissionId', 'name amount');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions report', error });
  }
});

module.exports = router;
