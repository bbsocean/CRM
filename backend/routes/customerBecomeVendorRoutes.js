const express = require('express');
const { 
  getCustomerBecomeAVendorDashboard, 
  registerCustomerAsVendor 
} = require('../controllers/customerBecomeVendorController');

const router = express.Router();

// ✅ GET: Route to fetch the vendor dashboard of a customer who became a vendor
router.get('/:customerId', getCustomerBecomeAVendorDashboard);

// ✅ POST: Route to register a customer as a vendor
router.post('/register', registerCustomerAsVendor);

module.exports = router;
