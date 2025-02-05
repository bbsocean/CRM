const Commission = require('../models/Commission');
const calculateCommission = async (sale) => {
  const commission = {};

  // Commission rates
  const rates = {
    agent: 0.05,  // 5% to agent
    franchisee: 0.02,  // 2% to franchisee
    territoryHead: 0.01,  // 1% to territory head
    vendor: 0.07,  // 7% to vendor
    customerVendor: 0.03,  // 3% to customer-turned-vendor
    referralBonus: 0.02,  // 2% referral bonus
  };

  // Calculate commissions based on the sale amount and given rates
  commission.agentCommission = sale.saleAmount * rates.agent;
  commission.franchiseeCommission = sale.franchiseeId ? sale.saleAmount * rates.franchisee : 0;
  commission.territoryHeadCommission = sale.territoryHeadId ? sale.saleAmount * rates.territoryHead : 0;
  commission.vendorCommission = sale.vendorId ? sale.saleAmount * rates.vendor : 0;
  commission.customerVendorCommission = sale.customerVendorId ? sale.saleAmount * rates.customerVendor : 0;
  commission.referralBonus = sale.referredBy ? sale.saleAmount * rates.referralBonus : 0;

  return commission;
};

const createCommissionRecord = async (sale) => {
  try {
    const commissions = await calculateCommission(sale);

    // Prepare an array of commission records to be inserted
    const commissionRecords = [];

    // Agent commission
    commissionRecords.push({
      saleId: sale._id,
      recipientId: sale.agentId,
      commissionAmount: commissions.agentCommission,
      role: 'Agent',
      status: 'Pending',
    });

    // Franchisee commission (if applicable)
    if (sale.franchiseeId) {
      commissionRecords.push({
        saleId: sale._id,
        recipientId: sale.franchiseeId,
        commissionAmount: commissions.franchiseeCommission,
        role: 'Franchisee',
        status: 'Pending',
      });
    }

    // Territory Head commission (if applicable)
    if (sale.territoryHeadId) {
      commissionRecords.push({
        saleId: sale._id,
        recipientId: sale.territoryHeadId,
        commissionAmount: commissions.territoryHeadCommission,
        role: 'Territory Head',
        status: 'Pending',
      });
    }

    // Vendor commission (if applicable)
    if (sale.vendorId) {
      commissionRecords.push({
        saleId: sale._id,
        recipientId: sale.vendorId,
        commissionAmount: commissions.vendorCommission,
        role: 'Vendor',
        status: 'Pending',
      });
    }

    // Customer-turned-Vendor commission (if applicable)
    if (sale.customerVendorId) {
      commissionRecords.push({
        saleId: sale._id,
        recipientId: sale.customerVendorId,
        commissionAmount: commissions.customerVendorCommission,
        role: 'Customer Vendor',
        status: 'Pending',
      });
    }

    // Referral bonus (if applicable)
    if (sale.referredBy) {
      commissionRecords.push({
        saleId: sale._id,
        recipientId: sale.referredBy,
        commissionAmount: commissions.referralBonus,
        role: 'Referral',
        status: 'Pending',
      });
    }

    // Insert all commission records into the database
    await Commission.insertMany(commissionRecords);
    console.log('✅ Commissions created successfully');
  } catch (error) {
    console.error('❌ Error creating commission records:', error);
    throw error;
  }
};

module.exports = { createCommissionRecord };
