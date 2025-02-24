// const Sale = require('../models/Sale');
// const Commission = require('../models/Commission');

// // ✅ Fetch Sales Reports
// exports.getSalesReport = async (req, res) => {
//   try {
//     const { period, startDate, endDate } = req.query;

//     // Filter by custom or preset time period
//     const filter = period === 'custom' && startDate && endDate
//       ? { saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
//       : getPredefinedPeriodFilter(period);

//     const salesData = await Sale.aggregate([
//       { $match: filter },
//       { $group: { _id: null, totalSales: { $sum: '$saleAmount' }, totalOrders: { $count: {} } } },
//     ]);

//     res.status(200).json({ salesData });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching sales report', error });
//   }
// };

// // ✅ Fetch Commission Reports
// exports.getCommissionReport = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const commissionData = await Commission.aggregate([
//       { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
//       { $group: { _id: null, totalCommissions: { $sum: '$commissionAmount' }, totalPayouts: { $sum: '$payoutAmount' } } }
//     ]);

//     res.status(200).json({ commissionData });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching commission report', error });
//   }
// };

// // Utility function for predefined time periods
// function getPredefinedPeriodFilter(period) {
//   const now = new Date();
//   switch (period) {
//     case 'daily':
//       return { saleDate: { $gte: new Date(now.setHours(0, 0, 0, 0)) } };
//     case 'weekly':
//       return { saleDate: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
//     case 'monthly':
//       return { saleDate: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
//     case 'yearly':
//       return { saleDate: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } };
//     default:
//       return {};
//   }
// }




// ✅ Fetch Sales Reports
// exports.getSalesReport = async (req, res) => {
//   try {
//     const { period, startDate, endDate } = req.query;

//     // Filter based on custom or predefined time period
//     const filter = period === 'custom' && startDate && endDate
//       ? { saleDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
//       : getPredefinedPeriodFilter(period);

//     const salesData = await Sale.aggregate([
//       { $match: filter },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: '$saleAmount' },
//           totalOrders: { $sum: 1 },  // Count total orders
//         },
//       },
//     ]);

//     res.status(200).json({ 
//       message: 'Sales report generated successfully',
//       data: salesData[0] || { totalSales: 0, totalOrders: 0 }
//     });
//   } catch (error) {
//     console.error('Error fetching sales report:', error);
//     res.status(500).json({ message: 'Error fetching sales report', error });
//   }
// };

const Sale = require('../models/Sale');
const Commission = require('../models/Commission');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// ✅ Get Sales Report
exports.getSalesReport = async (req, res) => {
  try {
    const salesData = await Sale.find().populate('agentId customerId', 'name email');
    res.status(200).json({ salesData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales report', error });
  }
};
// ✅ Get Payout Report
exports.getPayoutReport = async (req, res) => {
  try {
    const payouts = await Transaction.find().populate('recipientId commissionId', 'name amount');
    res.status(200).json({ payouts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payout report', error });
  }
};


// ✅ Fetch Commission Reports
exports.getCommissionReport = async (req, res) => {
  try {
    const { period, startDate, endDate } = req.query;

    // Filter based on custom or predefined time period
    const filter = period === 'custom' && startDate && endDate
      ? { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } }
      : getPredefinedPeriodFilterForCommissions(period);

    const commissionData = await Commission.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCommissions: { $sum: '$commissionAmount' },
          totalPayouts: { $sum: '$payoutAmount' },
        },
      },
    ]);

    res.status(200).json({
      message: 'Commission report generated successfully',
      data: commissionData[0] || { totalCommissions: 0, totalPayouts: 0 }
    });
  } catch (error) {
    console.error('Error fetching commission report:', error);
    res.status(500).json({ message: 'Error fetching commission report', error });
  }
};

// ✅ Fetch Top Performing Users Report
exports.getTopPerformersReport = async (req, res) => {
  try {
    const { period } = req.query;

    const filter = getPredefinedPeriodFilter(period);

    const topPerformers = await Sale.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$agentId',
          totalSales: { $sum: '$saleAmount' },
          salesCount: { $sum: 1 },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $project: {
          _id: 0,
          agentId: '$_id',
          totalSales: 1,
          salesCount: 1,
          userDetails: { $arrayElemAt: ['$userDetails', 0] },
        },
      },
    ]);

    res.status(200).json({
      message: 'Top performers report generated successfully',
      data: topPerformers,
    });
  } catch (error) {
    console.error('Error fetching top performers report:', error);
    res.status(500).json({ message: 'Error fetching top performers report', error });
  }
};

// ✅ Utility function for predefined time periods (for sales)
function getPredefinedPeriodFilter(period) {
  const now = new Date();
  switch (period) {
    case 'daily':
      return { saleDate: { $gte: new Date(now.setHours(0, 0, 0, 0)) } };
    case 'weekly':
      return { saleDate: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
    case 'monthly':
      return { saleDate: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
    case 'yearly':
      return { saleDate: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } };
    default:
      return {};
  }
}

// ✅ Utility function for predefined time periods (for commissions)
function getPredefinedPeriodFilterForCommissions(period) {
  const now = new Date();
  switch (period) {
    case 'daily':
      return { createdAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) } };
    case 'weekly':
      return { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
    case 'monthly':
      return { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
    case 'yearly':
      return { createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } };
    default:
      return {};
  }
}

// Exporting all functions correctly
// module.exports = {
//   // getSalesReport,
//   getCommissionReport,
//   getPayoutReport
// };