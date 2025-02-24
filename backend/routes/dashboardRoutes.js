const express = require('express');
const {
  getAdminOverview,
  getAgentDashboard,
  getFranchiseDashboard,
  getTerritoryHeadDashboard,
  getVendorDashboard,
  getReferralDashboard,
  getCustomerBecomeAVendorDashboard,
  getTopPerformers,
  getFailedPayouts,
} = require('../controllers/dashboardController');

const router = express.Router();

// Dashboard Routes
router.get('/admin-overview', getAdminOverview);
router.get('/agent/:agentId', getAgentDashboard);
router.get('/franchise/:franchiseId', getFranchiseDashboard);
router.get('/territory/:territoryHeadId', getTerritoryHeadDashboard);
router.get('/vendor/:vendorId', getVendorDashboard);
router.get('/referral/:userId', getReferralDashboard);
router.get('/customer-vendor/:customerId', getCustomerBecomeAVendorDashboard);
router.get('/failed-payouts', getFailedPayouts);
router.get('/top-performers', getTopPerformers);

module.exports = router;
