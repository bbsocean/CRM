// // backend/controllers/territoryHeadController.js

// const TerritoryHead = require('../models/TerritoryHead');
// const Agent = require('../models/Agent');
// const bcrypt = require('bcrypt');
// // GET all territory heads
// const getAllTerritoryHeads = async (req, res) => {
//   try {
//     const territoryHeads = await TerritoryHead.find().populate('agents', 'name email');
//     res.status(200).json(territoryHeads);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching territory heads', error: error.message });
//   }
// };

// // GET a specific territory head by ID
// const getTerritoryHeadById = async (req, res) => {
//   try {
//     const territoryHead = await TerritoryHead.findById(req.params.id).populate('agents', 'name email');
//     if (!territoryHead) {
//       return res.status(404).json({ message: 'Territory Head not found' });
//     }
//     res.status(200).json(territoryHead);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching territory head', error: error.message });
//   }
// };

// // POST a new territory head
// const createTerritoryHead = async (req, res) => {
//   const { name, email, password, region } = req.body;

//   try {
//     // Check if the territory head email already exists
//     const existingTerritoryHead = await TerritoryHead.findOne({ email });
//     if (existingTerritoryHead) {
//       return res.status(400).json({ message: 'Territory Head with this email already exists' });
//     }

//     // Hash the password before saving
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
    
//     // Create a new territory head
//     const newTerritoryHead = new TerritoryHead({
//       name,
//       email,
//       password, // Ideally, hash the password before saving
//       region,
//     });

//     const savedTerritoryHead = await newTerritoryHead.save();
//     res.status(201).json(savedTerritoryHead);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating territory head', error: error.message });
//   }
// };

// // PUT to update an existing territory head
// const updateTerritoryHead = async (req, res) => {
//   const { name, email, region } = req.body;

//   try {
//     const territoryHead = await TerritoryHead.findById(req.params.id);
//     if (!territoryHead) {
//       return res.status(404).json({ message: 'Territory Head not found' });
//     }

//     // Update details
//     territoryHead.name = name || territoryHead.name;
//     territoryHead.email = email || territoryHead.email;
//     territoryHead.region = region || territoryHead.region;

//     const updatedTerritoryHead = await territoryHead.save();
//     res.status(200).json(updatedTerritoryHead);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating territory head', error: error.message });
//   }
// };

// // DELETE a territory head
// const deleteTerritoryHead = async (req, res) => {
//   try {
//     const territoryHead = await TerritoryHead.findById(req.params.id);
//     if (!territoryHead) {
//       return res.status(404).json({ message: 'Territory Head not found' });
//     }

//     // Check if the territory head has agents before deleting
//     const hasAgents = await Agent.findOne({ territoryHead: territoryHead._id });
//     if (hasAgents) {
//       return res.status(400).json({ message: 'Cannot delete territory head with assigned agents' });
//     }

//     await territoryHead.remove();
//     res.status(200).json({ message: 'Territory Head deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting territory head', error: error.message });
//   }
// };

// module.exports = {
//   getAllTerritoryHeads,
//   getTerritoryHeadById,
//   createTerritoryHead,
//   updateTerritoryHead,
//   deleteTerritoryHead,
// };



const express = require("express");
const router = express.Router();
const TerritoryHead = require("../models/TerritoryHead");
const Transaction = require("../models/Transaction");
const Payout = require("../models/Payout");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Register a New Territory Head
router.post("/register", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, franchiseId, contactEmail, phone, region } = req.body;

    if (!name || !franchiseId || !contactEmail || !phone || !region) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTerritoryHead = new TerritoryHead({
      name,
      franchiseId,
      contactEmail,
      phone,
      region,
    });

    await newTerritoryHead.save();
    res.json({ success: true, message: "Territory Head registered successfully" });
  } catch (error) {
    console.error("Territory Head Registration Error:", error);
    res.status(500).json({ message: "Error registering territory head" });
  }
});

// ✅ Get All Territory Heads
router.get("/", verifyToken, async (req, res) => {
  try {
    const territoryHeads = await TerritoryHead.find().populate("franchiseId", "name").sort({ createdAt: -1 });
    res.json({ success: true, data: territoryHeads });
  } catch (error) {
    console.error("Fetch Territory Heads Error:", error);
    res.status(500).json({ message: "Error fetching territory heads" });
  }
});

// ✅ Get a Single Territory Head by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const territoryHead = await TerritoryHead.findById(req.params.id).populate("franchiseId", "name");

    if (!territoryHead) return res.status(404).json({ message: "Territory Head not found" });

    res.json({ success: true, data: territoryHead });
  } catch (error) {
    console.error("Fetch Territory Head Error:", error);
    res.status(500).json({ message: "Error fetching territory head" });
  }
});

// ✅ Update Territory Head Information
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, contactEmail, phone, region } = req.body;
    const territoryHead = await TerritoryHead.findById(req.params.id);

    if (!territoryHead) return res.status(404).json({ message: "Territory Head not found" });

    territoryHead.name = name || territoryHead.name;
    territoryHead.contactEmail = contactEmail || territoryHead.contactEmail;
    territoryHead.phone = phone || territoryHead.phone;
    territoryHead.region = region || territoryHead.region;

    await territoryHead.save();
    res.json({ success: true, message: "Territory Head updated successfully" });
  } catch (error) {
    console.error("Update Territory Head Error:", error);
    res.status(500).json({ message: "Error updating territory head" });
  }
});

// ✅ Delete Territory Head
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await TerritoryHead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Territory Head deleted successfully" });
  } catch (error) {
    console.error("Delete Territory Head Error:", error);
    res.status(500).json({ message: "Error deleting territory head" });
  }
});

// ✅ Get Territory Head's Sales & Transactions
router.get("/:id/transactions", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ territoryHeadId: req.params.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Territory Head Transactions Error:", error);
    res.status(500).json({ message: "Error fetching territory head transactions" });
  }
});

// ✅ Territory Head Payout Requests
router.post("/:id/payout-request", verifyToken, async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" });
    }

    const payout = new Payout({
      userId: req.user.id,
      territoryHeadId: req.params.id,
      amount,
      method,
      status: "pending",
    });

    await payout.save();
    res.json({ success: true, message: "Territory Head payout request submitted." });
  } catch (error) {
    console.error("Territory Head Payout Request Error:", error);
    res.status(500).json({ message: "Error requesting payout" });
  }
});

module.exports = router;

