const express = require('express');
const Sale = require('../models/Sale');
const Commission = require('../models/Commission');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Admin Dashboard Overview with Filters
router.get('/overview', async (req, res) => {
  try {
    const { startDate, endDate, agentId, productName, commissionStatus } = req.query;

    // Date filter
    const dateFilter = startDate && endDate ? {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    } : {};

    // Agent filter
    const agentFilter = agentId ? { agentId } : {};

    // Product filter
    const productFilter = productName ? { productName: new RegExp(productName, 'i') } : {};

    // Commission status filter (if provided)
    const commissionFilter = commissionStatus ? { status: commissionStatus } : {};

    // Calculate total sales based on filters
    const totalSales = await Sale.aggregate([
      { $match: { ...dateFilter, ...agentFilter, ...productFilter } },
      { $group: { _id: null, total: { $sum: '$saleAmount' } } }
    ]);

    // Count total commissions and filter pending commissions if needed
    const totalCommissions = await Commission.countDocuments(commissionFilter);
    const pendingCommissions = await Commission.countDocuments({ status: 'Pending' });

    // Calculate total payouts
    const totalPayouts = await Transaction.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Find top-performing agents by total sales
    const topAgents = await Sale.aggregate([
      { $match: { ...dateFilter, ...productFilter } },
      { $group: { _id: '$agentId', totalSales: { $sum: '$saleAmount' } } },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      totalCommissions,
      pendingCommissions,
      totalPayouts: totalPayouts[0]?.total || 0,
      topAgents
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin overview', error });
  }
});

module.exports = router;
