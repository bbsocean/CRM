const Commission = require('../models/Commission');

exports.getPendingCommissions = async (req, res) => {
  try {
    // Fetch all commissions with status "Pending"
    const pendingCommissions = await Commission.find({ status: 'Pending' }).populate('recipientId', 'name role');

    res.status(200).json({ message: 'Pending commissions retrieved', data: pendingCommissions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending commissions', error });
  }
};
