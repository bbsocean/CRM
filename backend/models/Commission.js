const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  saleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },

  // Multi-level commissions
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  franchiseeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  territoryHeadId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
  referralId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  

  // Commission amounts
  agentCommission: { type: Number, default: 0 },
  franchiseeCommission: { type: Number, default: 0 },
  territoryHeadCommission: { type: Number, default: 0 },
  vendorCommission: { type: Number, default: 0 },
  customerVendorCommission: { type: Number, default: 0 },  
  referralBonus: { type: Number, default: 0 },  

  currency: { type: String, default: 'INR' },  
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  
  createdAt: { type: Date, default: Date.now },
  payoutDate: { type: Date },

  amount: { type: Number, required: true },
  type: { type: String, enum: ["Sales", "Referral", "Vendor Commission"], required: true },
  hierarchyLevel: { type: String, required: true }
});

module.exports = mongoose.model('Commission', commissionSchema);
