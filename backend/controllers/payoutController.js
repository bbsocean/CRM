const Sale = require('../models/Sale');
const Commission = require('../models/Commission');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.createSale = async (req, res) => {
  try {
    const { productName, saleAmount, customerId, agentId } = req.body;

    // Create the sale record
    const newSale = await Sale.create({ productName, saleAmount, customerId, agentId });

    // Fetch the agent and their territory head/franchisee relationships
    const agent = await User.findById(agentId);
    const territoryHead = await User.findById(agent.assignedTo);  // Assuming assignedTo points to territory head
    const franchisee = await User.findById(territoryHead?.assignedTo);

    // Calculate and create commissions
    const commissions = [];

    // Agent commission
    const agentCommission = (saleAmount * 0.10);  // Example 10% rate
    commissions.push(await Commission.create({
      saleId: newSale._id,
      recipientId: agentId,
      amount: agentCommission,
      status: 'Pending'
    }));

    // Territory head commission (if applicable)
    if (territoryHead) {
      const territoryCommission = (saleAmount * 0.05);  // Example 5% rate
      commissions.push(await Commission.create({
        saleId: newSale._id,
        recipientId: territoryHead._id,
        amount: territoryCommission,
        status: 'Pending'
      }));
    }

    // Franchisee commission (if applicable)
    if (franchisee) {
      const franchiseCommission = (saleAmount * 0.03);  // Example 3% rate
      commissions.push(await Commission.create({
        saleId: newSale._id,
        recipientId: franchisee._id,
        amount: franchiseCommission,
        status: 'Pending'
      }));
    }
    res.status(201).json({ message: 'Sale created and commissions calculated', commissions });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }

  
// ✅ Create a new payout after verifying the commission hasn't been paid
exports.createPayout = async (req, res) => {
  const { recipientId, commissionId, amount, paymentMethod } = req.body;

  try {
    // Step 1: Check if a transaction for this commissionId already exists
    const existingTransaction = await Transaction.findOne({ commissionId });
    if (existingTransaction) {
      return res.status(400).json({
        message: 'Payout for this commission has already been processed.',
      });
    }

    // Step 2: Create a new transaction
    const newTransaction = new Transaction({
      recipientId,
      commissionId,
      amount,
      paymentMethod,
      status: 'Pending',  // Initially pending
    });

    await newTransaction.save();

    // Step 3: Mark commission as paid
    await Commission.findByIdAndUpdate(commissionId, { status: 'Paid' });

    res.status(201).json({
      message: 'Payout created successfully.',
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

};


exports.processPayout = async (req, res) => {
  try {
    const { amount, recipientId, paymentMethod } = req.body;

    // Placeholder logic for processing payout
    console.log(`Processing payout of ${amount} to recipient ${recipientId} via ${paymentMethod}`);
    
    // Respond back
    res.status(200).json({ message: 'Payout processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payout', error });
  }
};

