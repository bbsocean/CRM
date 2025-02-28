// backend/routes/agentRoutes.js

const express = require('express');
const { 
  getAllAgents, 
  getAgentById, 
  createAgent, 
  updateAgent, 
  deleteAgent 
} = require('../controllers/agentController');

const router = express.Router();

const Vendor = require("../models/Vendor");

// ✅ Fetch Vendors for Agent Marketplace
router.get("/agent/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Error retrieving vendors" });
  }
});
// GET all agents
router.get('/', getAllAgents);

// GET a specific agent by ID
router.get('/:id', getAgentById);

// POST a new agent
router.post('/', createAgent);

// PUT to update an existing agent
router.put('/:id', updateAgent);

// DELETE an agent
router.delete('/:id', deleteAgent);

module.exports = router;
