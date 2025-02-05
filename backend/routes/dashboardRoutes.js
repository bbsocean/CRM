const express = require('express');
const { 
  getAdminOverview, 
  getAgentDashboard, 
  getFranchiseDashboard, 
  getTerritoryHeadDashboard, 
  getVendorDashboard, 
  getReferralDashboard,
  getCustomerBecomeAVendorDashboard
} = require('../controllers/dashboardController');
const { getFailedPayouts } = require('../controllers/dashboardController');

const router = express.Router();

// Routes for dashboards
router.get('/admin-overview', getAdminOverview);
router.get('/agent/:agentId', getAgentDashboard);
router.get('/franchise/:franchiseId', getFranchiseDashboard);
router.get('/territory/:territoryHeadId', getTerritoryHeadDashboard);
router.get('/vendor/:vendorId', getVendorDashboard);
router.get('/referral/:userId', getReferralDashboard);
router.get('/customer-vendor/:customerId', getCustomerBecomeAVendorDashboard);
router.get('/failed-payouts', getFailedPayouts);

module.exports = router;
