const Sale = require('../models/Sale');
const Commission = require('../models/Commission');
const User = require('../models/User');

exports.createSale = async (req, res) => {
  try {
    const { productName, saleAmount, customerId, agentId } = req.body;

    // Step 1: Create the sale record
    const newSale = await Sale.create({ productName, saleAmount, customerId, agentId });

    // Step 2: Fetch relationships (agent -> territory head -> franchisee)
    const agent = await User.findById(agentId);
    const territoryHead = await User.findById(agent?.assignedTo);  // Agent assigned to territory head
    const franchisee = await User.findById(territoryHead?.assignedTo);  // Territory head assigned to franchisee

    // Step 3: Commission rate settings (can be moved to settings for dynamic control)
    const agentRate = 0.10;       // Agent gets 10% commission
    const territoryRate = 0.05;   // Territory head gets 5% of agent's sales
    const franchiseRate = 0.03;   // Franchisee gets 3% of territory sales

    // Step 4: Calculate commissions and save them
    const commissions = [];

    // Agent commission
    const agentCommission = saleAmount * agentRate;
    commissions.push(await Commission.create({
      saleId: newSale._id,
      recipientId: agentId,
      amount: agentCommission,
      status: 'Pending'
    }));

    // Territory head commission (if applicable)
    if (territoryHead) {
      const territoryCommission = saleAmount * territoryRate;
      commissions.push(await Commission.create({
        saleId: newSale._id,
        recipientId: territoryHead._id,
        amount: territoryCommission,
        status: 'Pending'
      }));
    }

    // Franchisee commission (if applicable)
    if (franchisee) {
      const franchiseCommission = saleAmount * franchiseRate;
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
};
