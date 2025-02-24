// const Sale = require('../models/Sale');
// const Commission = require('../models/Commission');
// const Transaction = require('../models/Transaction');
// const Referral = require('../models/Referral');
// const User = require('../models/User');
// const Payout = require('../models/Payout');

// // -------------------- Admin Dashboard --------------------
// exports.getAdminOverview = async (req, res) => {
//   try {
//     const totalSales = await Sale.aggregate([{ $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
//     const totalCommissions = await Commission.countDocuments();
//     const pendingCommissions = await Commission.countDocuments({ status: 'Pending' });
//     const totalPayouts = await Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);

//     const topAgents = await Sale.aggregate([
//       { $group: { _id: '$agentId', totalSales: { $sum: '$saleAmount' } } },
//       { $sort: { totalSales: -1 } },
//       { $limit: 5 },
//       { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agentDetails' } }
//     ]);

//     res.status(200).json({
//       totalSales: totalSales[0]?.total || 0,
//       totalCommissions,
//       pendingCommissions,
//       totalPayouts: totalPayouts[0]?.total || 0,
//       topAgents: topAgents.map(agent => ({
//         agentId: agent._id,
//         totalSales: agent.totalSales,
//         agentDetails: agent.agentDetails[0]
//       }))
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching admin overview', error });
//   }
// };

// // -------------------- Franchise Dashboard --------------------
// exports.getFranchiseDashboard = async (req, res) => {
//   try {
//     const { franchiseId } = req.params;
//     const totalSales = await Sale.aggregate([{ $match: { franchiseId } }, { $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
//     const totalCommissions = await Commission.aggregate([{ $match: { recipientId: franchiseId } }, { $group: { _id: null, total: { $sum: '$commissionAmount' } } }]);

//     res.status(200).json({
//       totalSales: totalSales[0]?.total || 0,
//       totalCommissions: totalCommissions[0]?.total || 0
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching franchise dashboard', error });
//   }
// };

// // -------------------- Territory Head Dashboard --------------------
// exports.getTerritoryHeadDashboard = async (req, res) => {
//   try {
//     const { territoryHeadId } = req.params;
//     const agents = await User.find({ role: 'Agent', territoryHeadId }).select('_id');
//     const agentIds = agents.map(agent => agent._id);

//     const totalSales = await Sale.aggregate([{ $match: { agentId: { $in: agentIds } } }, { $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
//     const totalCommissions = await Commission.aggregate([{ $match: { recipientId: territoryHeadId } }, { $group: { _id: null, total: { $sum: '$commissionAmount' } } }]);

//     res.status(200).json({
//       totalSales: totalSales[0]?.total || 0,
//       totalCommissions: totalCommissions[0]?.total || 0,
//       agentList: agents
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching territory head dashboard', error });
//   }
// };

// // -------------------- Agent Dashboard --------------------
// exports.getAgentDashboard = async (req, res) => {
//   try {
//     const { agentId } = req.params;
//     const totalSales = await Sale.aggregate([{ $match: { agentId } }, { $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
//     const commissions = await Commission.find({ recipientId: agentId });
//     const totalCommissions = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);

//     res.status(200).json({
//       totalSales: totalSales[0]?.total || 0,
//       totalCommissions
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching agent dashboard', error });
//   }
// };

// // -------------------- Vendor Dashboard --------------------
// exports.getVendorDashboard = async (req, res) => {
//   try {
//     const { vendorId } = req.params;
//     const sales = await Sale.find({ vendorId });
//     const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0);

//     const commissions = await Commission.find({ recipientId: vendorId });
//     const totalCommissions = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);

//     res.status(200).json({
//       totalSales,
//       totalCommissions,
//       salesHistory: sales
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching vendor dashboard', error });
//   }
// };

// // -------------------- Customer Become a Vendor Dashboard --------------------
// exports.getCustomerBecomeAVendorDashboard = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const vendorDetails = await User.findById(customerId);

//     if (!vendorDetails || vendorDetails.role !== 'Vendor') {
//       return res.status(400).json({ message: 'Customer has not become a vendor yet' });
//     }

//     const sales = await Sale.find({ vendorId: customerId });
//     const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0);

//     res.status(200).json({
//       vendorDetails,
//       totalSales,
//       salesHistory: sales
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching customer vendor dashboard', error });
//   }
// };

// // -------------------- Referral Dashboard --------------------
// exports.getReferralDashboard = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const referralBonuses = await Referral.aggregate([{ $match: { referrerId: userId } }, { $group: { _id: null, totalBonus: { $sum: '$bonusAmount' } } }]);
//     const referredUsers = await User.find({ referredBy: userId });

//     res.status(200).json({
//       totalReferralBonus: referralBonuses[0]?.totalBonus || 0,
//       referredUsers
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching referral dashboard', error });
//   }
// };

// // -------------------- Failed Payouts  --------------------
// exports.getFailedPayouts = async (req, res) => {
//   try {
//     const failedPayouts = await Payout.find({ status: 'Failed' });
//     res.status(200).json(failedPayouts);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching failed payouts', error: error.message });
//   }
// };
//-----------------------------------------------------------------------------------------------------------



// const Sale = require('../models/Sale');
// const Commission = require('../models/Commission');
// const Transaction = require('../models/Transaction');
// const Referral = require('../models/Referral');
// const User = require('../models/User');
// const Payout = require('../models/Payout');
// const { getStartDate } = require('../utils/dateUtils'); // :check: Import utility function
// // -------------------- Admin Dashboard --------------------
// exports.getAdminOverview = async (req, res) => {
//   try {
//     const totalSales = await Sale.aggregate([{ $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
//     const totalCommissions = await Commission.countDocuments();
//     const pendingCommissions = await Commission.countDocuments({ status: 'Pending' });
//     const totalPayouts = await Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);

//     const topAgents = await Sale.aggregate([
//       { $group: { _id: '$agentId', totalSales: { $sum: '$saleAmount' } } },
//       { $sort: { totalSales: -1 } },
//       { $limit: 5 },
//       { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agentDetails' } }
//     ]);

//     res.status(200).json({
//       totalSales: totalSales[0]?.total || 0,
//       totalCommissions,
//       pendingCommissions,
//       totalPayouts: totalPayouts[0]?.total || 0,
//       topAgents: topAgents.map(agent => ({
//         agentId: agent._id,
//         totalSales: agent.totalSales,
//         agentDetails: agent.agentDetails[0]
//       }))
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching admin overview', error });
//   }
// };

// // -------------------- Franchise Dashboard --------------------
// exports.getFranchiseDashboard = async (req, res) => {
//   try {
//     const { franchiseId } = req.params;
//     const totalSales = await Sale.aggregate([{ $match: { franchiseId } }, { $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
//     const totalCommissions = await Commission.aggregate([{ $match: { recipientId: franchiseId } }, { $group: { _id: null, total: { $sum: '$commissionAmount' } } }]);

//     res.status(200).json({
//       totalSales: totalSales[0]?.total || 0,
//       totalCommissions: totalCommissions[0]?.total || 0
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching franchise dashboard', error });
//   }
// };

// // -------------------- Territory Head Dashboard --------------------
// exports.getTerritoryHeadDashboard = async (req, res) => {
//   try {
//     const { territoryHeadId } = req.params;
//     const agents = await User.find({ role: 'Agent', territoryHeadId }).select('_id');
//     const agentIds = agents.map(agent => agent._id);

//     const totalSales = await Sale.aggregate([{ $match: { agentId: { $in: agentIds } } }, { $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
//     const totalCommissions = await Commission.aggregate([{ $match: { recipientId: territoryHeadId } }, { $group: { _id: null, total: { $sum: '$commissionAmount' } } }]);

//     res.status(200).json({
//       totalSales: totalSales[0]?.total || 0,
//       totalCommissions: totalCommissions[0]?.total || 0,
//       agentList: agents
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching territory head dashboard', error });
//   }
// };

// // -------------------- Agent Dashboard --------------------
// exports.getAgentDashboard = async (req, res) => {
//   try {
//     const { agentId } = req.params;
//     const totalSales = await Sale.aggregate([{ $match: { agentId } }, { $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
//     const commissions = await Commission.find({ recipientId: agentId });
//     const totalCommissions = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);

//     res.status(200).json({
//       totalSales: totalSales[0]?.total || 0,
//       totalCommissions
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching agent dashboard', error });
//   }
// };

// // -------------------- Vendor Dashboard --------------------
// exports.getVendorDashboard = async (req, res) => {
//   try {
//     const { vendorId } = req.params;
//     const sales = await Sale.find({ vendorId });
//     const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0);

//     const commissions = await Commission.find({ recipientId: vendorId });
//     const totalCommissions = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);

//     res.status(200).json({
//       totalSales,
//       totalCommissions,
//       salesHistory: sales
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching vendor dashboard', error });
//   }
// };

// // -------------------- Customer Become a Vendor Dashboard --------------------
// exports.getCustomerBecomeAVendorDashboard = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const vendorDetails = await User.findById(customerId);

//     if (!vendorDetails || vendorDetails.role !== 'Vendor') {
//       return res.status(400).json({ message: 'Customer has not become a vendor yet' });
//     }

//     const sales = await Sale.find({ vendorId: customerId });
//     const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0);

//     res.status(200).json({
//       vendorDetails,
//       totalSales,
//       salesHistory: sales
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching customer vendor dashboard', error });
//   }
// };

// // -------------------- Top Performers  --------------------
// exports.getTopPerformers = async (req, res) => {
//   try {
//     const periods = ['daily', 'weekly', 'monthly', 'yearly'];
//     const userRoles = ['Agent', 'Franchise', 'TerritoryHead', 'Vendor', 'CustomerVendor'];
//     const topPerformers = {};

//     for (let role of userRoles) {
//       topPerformers[role] = {};

//       for (let period of periods) {
//         const startDate = getStartDate(period);

//         // Fetch sales grouped by the user role and time period
//         const salesAggregation = await Sale.aggregate([
//           { $match: { saleDate: { $gte: startDate }, [`${role.toLowerCase()}Id`]: { $exists: true } } },
//           {
//             $group: {
//               _id: `$${role.toLowerCase()}Id`,
//               totalSales: { $sum: '$saleAmount' },
//               salesCount: { $sum: 1 }
//             }
//           },
//           { $sort: { totalSales: -1 } },  // Sort by sales in descending order
//           { $limit: 5 }  // Get top 5 performers
//         ]);

//         // Fetch user details for each top performer
//         const performerDetails = await Promise.all(
//           salesAggregation.map(async (sale) => {
//             const user = await User.findById(sale._id);  // Fetch the user details
//             return {
//               userId: sale._id,
//               name: user ? user.name : 'Unknown',
//               role,
//               totalSales: sale.totalSales,
//               salesCount: sale.salesCount,
//               cashReward: sale.totalSales * 0.05  // Assign 5% of total sales as a cash reward
//             };
//           })
//         );

//         topPerformers[role][period] = performerDetails;
//       }
//     }

//     res.status(200).json({
//       message: 'Top performers and cash rewards calculated successfully',
//       topPerformers
//     });

//   } catch (error) {
//     console.error('Error calculating top performers:', error);
//     res.status(500).json({ message: 'Error calculating top performers', error });
//   }
// };
//--------------------------------------------------

const Sale = require('../models/Sale');
const Commission = require('../models/Commission');
const Transaction = require('../models/Transaction');
const Referral = require('../models/Referral');
const User = require('../models/User');
const Payout = require('../models/Payout');
const { getStartDate } = require('../utils/dateHelpers');
const Reward = require('../models/Reward');

// -------------------- Admin Dashboard --------------------
exports.getAdminOverview = async (req, res) => {
  try {
    const totalSales = await Sale.aggregate([{ $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
    const totalCommissions = await Commission.countDocuments();
    const pendingCommissions = await Commission.countDocuments({ status: 'Pending' });
    const totalPayouts = await Transaction.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);

    const topAgents = await Sale.aggregate([
      { $group: { _id: '$agentId', totalSales: { $sum: '$saleAmount' } } },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agentDetails' } }
    ]);

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      totalCommissions,
      pendingCommissions,
      totalPayouts: totalPayouts[0]?.total || 0,
      topAgents: topAgents.map(agent => ({
        agentId: agent._id,
        totalSales: agent.totalSales,
        agentDetails: agent.agentDetails[0]
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin overview', error });
  }
};

// -------------------- Agent Dashboard --------------------
exports.getAgentDashboard = async (req, res) => {
  try {
    const { agentId } = req.params;
    const mongoose = require('mongoose');
    const objectIdAgentId = mongoose.Types.ObjectId(agentId);

    // ✅ Fetch total sales for the agent
    const totalSales = await Sale.aggregate([
      { $match: { agentId: objectIdAgentId } },
      { $group: { _id: null, total: { $sum: '$saleAmount' } } }
    ]);

    // ✅ Fetch total commissions for the agent
    const commissions = await Commission.aggregate([
      { $match: { recipientId: objectIdAgentId } },
      { $group: { _id: null, totalCommissions: { $sum: '$commissionAmount' } } }
    ]);

    // ✅ Fetch sales history for the agent (most recent 5 sales)
    const salesHistory = await Sale.find({ agentId: objectIdAgentId })
      .sort({ saleDate: -1 })
      .limit(5)
      .select('productName saleAmount saleDate');

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      totalCommissions: commissions[0]?.totalCommissions || 0,
      salesHistory
    });

  } catch (error) {
    console.error('Error fetching agent dashboard:', error);
    res.status(500).json({ message: 'Error fetching agent dashboard', error });
  }
};


// -------------------- Franchise Dashboard --------------------
exports.getFranchiseDashboard = async (req, res) => {
  try {
    const { franchiseId } = req.params;
    const totalSales = await Sale.aggregate([{ $match: { franchiseId } }, { $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
    const totalCommissions = await Commission.aggregate([{ $match: { recipientId: franchiseId } }, { $group: { _id: null, total: { $sum: '$commissionAmount' } } }]);

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      totalCommissions: totalCommissions[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching franchise dashboard', error });
  }
};

// -------------------- Territory Head Dashboard --------------------
exports.getTerritoryHeadDashboard = async (req, res) => {
  try {
    const { territoryHeadId } = req.params;
    const agents = await User.find({ role: 'Agent', territoryHeadId }).select('_id');
    const agentIds = agents.map(agent => agent._id);

    const totalSales = await Sale.aggregate([{ $match: { agentId: { $in: agentIds } } }, { $group: { _id: null, total: { $sum: '$saleAmount' } } }]);
    const totalCommissions = await Commission.aggregate([{ $match: { recipientId: territoryHeadId } }, { $group: { _id: null, total: { $sum: '$commissionAmount' } } }]);

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      totalCommissions: totalCommissions[0]?.total || 0,
      agentList: agents
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching territory head dashboard', error });
  }
};

// -------------------- Vendor Dashboard --------------------
exports.getVendorDashboard = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const sales = await Sale.find({ vendorId });
    const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0);

    const commissions = await Commission.find({ recipientId: vendorId });
    const totalCommissions = commissions.reduce((sum, commission) => sum + commission.commissionAmount, 0);

    res.status(200).json({
      totalSales,
      totalCommissions,
      salesHistory: sales
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor dashboard', error });
  }
};

// -------------------- Customer Become a Vendor Dashboard --------------------
const mongoose = require('mongoose');

exports.getCustomerBecomeAVendorDashboard = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate that the customerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customerId format' });
    }

    // Proceed with the rest of the logic
    const vendorDetails = await User.findById(customerId);
    if (!vendorDetails || vendorDetails.role !== 'Vendor') {
      return res.status(400).json({ message: 'Customer has not become a vendor yet' });
    }

    const sales = await Sale.find({ vendorId: customerId });
    const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0);

    res.status(200).json({
      vendorDetails,
      totalSales,
      salesHistory: sales,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer vendor dashboard', error });
  }
};


// -------------------- Referral Dashboard --------------------
exports.getReferralDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const referralBonuses = await Referral.aggregate([{ $match: { referrerId: userId } }, { $group: { _id: null, totalBonus: { $sum: '$bonusAmount' } } }]);
    
    // Fetch users referred by this referrer 
    const referredUsers = await User.find({ referredBy: userId }).select('name email role');

    res.status(200).json({
      totalReferralBonus: referralBonuses[0]?.totalBonus || 0,
      referredUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching referral dashboard', error });
  }
};

// -------------------- Failed Payouts --------------------
exports.getFailedPayouts = async (req, res) => {
  try {
    const failedPayouts = await Payout.find({ status: 'Failed' });
    res.status(200).json(failedPayouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching failed payouts', error });
  }
};

// -------------------- Top Performers --------------------
exports.getTopPerformers = async (req, res) => {
  try {
    const periods = ['daily', 'weekly', 'monthly', 'yearly'];
    const userRoles = ['Agent', 'Franchise', 'TerritoryHead', 'Vendor', 'CustomerVendor'];
    const topPerformers = {};

   // Inside the top performer loop (in getTopPerformers)
 for (let role of userRoles) {
  topPerformers[role] = {};

  for (let period of periods) {
    const startDate = getStartDate(period);

    const salesAggregation = await Sale.aggregate([
      { $match: { saleDate: { $gte: startDate }, [`${role.toLowerCase()}Id`]: { $exists: true } } },
      { $group: { _id: `$${role.toLowerCase()}Id`, totalSales: { $sum: '$saleAmount' }, salesCount: { $sum: 1 } } },
      { $sort: { totalSales: -1 } },
      { $limit: 5 }
    ]);

    const performerDetails = await Promise.all(
      salesAggregation.map(async (sale) => {
        const user = await User.findById(sale._id);
        const rewardAmount = sale.totalSales * 0.05;

        // ✅ Store the reward
        await Reward.create({
          userId: sale._id,
          role,
          period,
          rewardAmount
        });

        return {
          userId: sale._id,
          name: user ? user.name : 'Unknown',
          role,
          totalSales: sale.totalSales,
          salesCount: sale.salesCount,
          cashReward: rewardAmount
        };
      })
    );

    topPerformers[role][period] = performerDetails;
   }
}

    res.status(200).json({
      message: 'Top performers and cash rewards calculated successfully',
      topPerformers
    });
  } catch (error) {
    console.error('Error calculating top performers:', error);
    res.status(500).json({ message: 'Error calculating top performers', error });
  }
};
