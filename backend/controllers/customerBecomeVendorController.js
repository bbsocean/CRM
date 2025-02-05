const mongoose = require('mongoose');
const User = require('../models/User');
const Sale = require('../models/Sale');

// ✅ Function 1: Register customer as vendor
exports.registerCustomerAsVendor = async (req, res) => {
  try {
    const { customerId } = req.body;

    // Check if customer exists
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    // Update the customer's role to 'Vendor'
    customer.role = 'Vendor';
    await customer.save();

    res.status(200).json({ message: 'Customer has been successfully registered as a vendor.' });
  } catch (error) {
    console.error('Error registering customer as vendor:', error);
    res.status(500).json({ message: 'Error registering customer as vendor', error: error.message });
  }
};

// ✅ Function 2: Fetch the vendor dashboard for a customer who became a vendor
exports.getCustomerBecomeAVendorDashboard = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Validate and convert customerId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ message: 'Invalid customerId provided.' });
    }

    const vendorDetails = await User.findById(customerId);
    if (!vendorDetails) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    if (vendorDetails.role !== 'Vendor') {
      return res.status(400).json({ message: 'Customer is not registered as a vendor.' });
    }

    // Fetch the sales data associated with this vendor
    const sales = await Sale.find({ vendorId: customerId });
    const totalSales = sales.reduce((sum, sale) => sum + sale.saleAmount, 0);

    res.status(200).json({
      vendorDetails,
      totalSales,
      salesHistory: sales,
    });
  } catch (error) {
    console.error('Error fetching vendor dashboard:', error);
    res.status(500).json({ message: 'Error fetching vendor dashboard', error: error.message });
  }
};
