// const Franchise = require('../models/Franchise');  // Adjust based on your path

// exports.createFranchise = async (req, res) => {
//   try {
//     const { name, email, phoneNumber, location } = req.body;

//     // Check if the franchise email already exists
//     const existingFranchise = await Franchise.findOne({ email });
//     if (existingFranchise) {
//       return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
//     }

//     // Create new franchise
//     const newFranchise = new Franchise({ name, email, phoneNumber, location });
//     await newFranchise.save();

//     res.status(201).json({ message: 'Franchise created successfully', franchise: newFranchise });
//   } catch (error) {
//     console.error('Error creating franchise:', error);
//     res.status(500).json({ message: 'Failed to create franchise', error: error.message });
//   }
// };


const express = require("express");
const router = express.Router();
const Franchise = require("../models/Franchise");
const Transaction = require("../models/Transaction");
const Payout = require("../models/Payout");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Register a New Franchise
router.post("/register", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, ownerName, contactEmail, phone, location } = req.body;

    if (!name || !ownerName || !contactEmail || !phone || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFranchise = new Franchise({
      name,
      ownerName,
      contactEmail,
      phone,
      location,
    });

    await newFranchise.save();
    res.json({ success: true, message: "Franchise registered successfully" });
  } catch (error) {
    console.error("Franchise Registration Error:", error);
    res.status(500).json({ message: "Error registering franchise" });
  }
});

// ✅ Get All Franchises
router.get("/", verifyToken, async (req, res) => {
  try {
    const franchises = await Franchise.find().sort({ createdAt: -1 });
    res.json({ success: true, data: franchises });
  } catch (error) {
    console.error("Fetch Franchises Error:", error);
    res.status(500).json({ message: "Error fetching franchises" });
  }
});

// ✅ Get a Single Franchise by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const franchise = await Franchise.findById(req.params.id);

    if (!franchise) return res.status(404).json({ message: "Franchise not found" });

    res.json({ success: true, data: franchise });
  } catch (error) {
    console.error("Fetch Franchise Error:", error);
    res.status(500).json({ message: "Error fetching franchise" });
  }
});

// ✅ Update Franchise Information
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, ownerName, contactEmail, phone, location } = req.body;
    const franchise = await Franchise.findById(req.params.id);

    if (!franchise) return res.status(404).json({ message: "Franchise not found" });

    franchise.name = name || franchise.name;
    franchise.ownerName = ownerName || franchise.ownerName;
    franchise.contactEmail = contactEmail || franchise.contactEmail;
    franchise.phone = phone || franchise.phone;
    franchise.location = location || franchise.location;

    await franchise.save();
    res.json({ success: true, message: "Franchise updated successfully" });
  } catch (error) {
    console.error("Update Franchise Error:", error);
    res.status(500).json({ message: "Error updating franchise" });
  }
});

// ✅ Delete Franchise
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Franchise.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Franchise deleted successfully" });
  } catch (error) {
    console.error("Delete Franchise Error:", error);
    res.status(500).json({ message: "Error deleting franchise" });
  }
});

// ✅ Get Franchise Sales & Transactions
router.get("/:id/transactions", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ franchiseId: req.params.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Franchise Transactions Error:", error);
    res.status(500).json({ message: "Error fetching franchise transactions" });
  }
});

// ✅ Franchise Payout Requests
router.post("/:id/payout-request", verifyToken, async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" });
    }

    const payout = new Payout({
      userId: req.user.id,
      franchiseId: req.params.id,
      amount,
      method,
      status: "pending",
    });

    await payout.save();
    res.json({ success: true, message: "Franchise payout request submitted." });
  } catch (error) {
    console.error("Franchise Payout Request Error:", error);
    res.status(500).json({ message: "Error requesting payout" });
  }
});

module.exports = router;
