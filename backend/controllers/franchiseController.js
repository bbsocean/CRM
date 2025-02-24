const Franchise = require('../models/Franchise');  // Adjust based on your path

exports.createFranchise = async (req, res) => {
  try {
    const { name, email, phoneNumber, location } = req.body;

    // Check if the franchise email already exists
    const existingFranchise = await Franchise.findOne({ email });
    if (existingFranchise) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
    }

    // Create new franchise
    const newFranchise = new Franchise({ name, email, phoneNumber, location });
    await newFranchise.save();

    res.status(201).json({ message: 'Franchise created successfully', franchise: newFranchise });
  } catch (error) {
    console.error('Error creating franchise:', error);
    res.status(500).json({ message: 'Failed to create franchise', error: error.message });
  }
};
