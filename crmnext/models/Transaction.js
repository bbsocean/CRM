const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Who is receiving the payout
  commissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commission', required: true },  // Linked commission record

  amount: { type: Number, required: true },  // Amount to be paid
  currency: { type: String, default: 'INR' },  // Multi-currency support (default INR)

  // Payment-related information
  paymentMethod: { type: String, enum: ['Bank Transfer', 'Wallet', 'UPI', 'Other'], required: true },
  paymentReference: { type: String },  // Reference number for the payment (e.g., transaction ID)
  bankDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    IFSC: { type: String }  // For identifying the branch
  },

  // Payout status tracking
  status: { type: String, enum: ['Pending', 'Processing', 'Failed', 'Completed'], default: 'Pending' },
  transactionDate: { type: Date, default: Date.now },  // Date when the transaction was initiated
  payoutDate: { type: Date },  // Date when payout was completed (if applicable)

  failureReason: { type: String }  // If payment fails, store the reason
});

module.exports = mongoose.model('Transaction', transactionSchema);
