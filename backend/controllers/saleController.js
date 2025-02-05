const Sale = require('../models/Sale');
const { createCommissionRecord } = require('../services/commissionService');

exports.createSale = async (req, res) => {
  const {
    agentId,
    customerId,
    productName,
    saleAmount,
    franchiseeId,
    territoryHeadId,
    vendorId,
    referredBy,
    customerVendorId,
  } = req.body;

  try {
    // Create the new sale record
    const sale = new Sale({
      agentId,
      customerId,
      productName,
      saleAmount,
      franchiseeId,
      territoryHeadId,
      vendorId,
      referredBy,
      customerVendorId,
    });

    await sale.save();

    // Calculate commissions and create a commission record
    await createCommissionRecord(sale);

    res.status(201).json({
      message: 'Sale and commission recorded successfully',
      sale,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale', error });
  }
};
