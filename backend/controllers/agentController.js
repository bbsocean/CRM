// // backend/controllers/agentController.js

// const Agent = require('../models/Agent');
// const TerritoryHead = require('../models/TerritoryHead');

// // GET all agents
// const getAllAgents = async (req, res) => {
//   try {
//     const agents = await Agent.find().populate('territoryHead', 'name email region');
//     res.status(200).json(agents);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching agents', error: error.message });
//   }
// };

// // GET a specific agent by ID
// const getAgentById = async (req, res) => {
//   try {
//     const agent = await Agent.findById(req.params.id).populate('territoryHead', 'name email region');
//     if (!agent) {
//       return res.status(404).json({ message: 'Agent not found' });
//     }
//     res.status(200).json(agent);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching agent', error: error.message });
//   }
// };

// // POST a new agent
// const createAgent = async (req, res) => {
//   const { name, email, password, territoryHead } = req.body;

//   try {
//     // Check if the territory head exists
//     const territoryExists = await TerritoryHead.findById(territoryHead);
//     if (!territoryExists) {
//       return res.status(404).json({ message: 'Assigned territory head not found' });
//     }

//     // Check if the agent email already exists
//     const existingAgent = await Agent.findOne({ email });
//     if (existingAgent) {
//       return res.status(400).json({ message: 'Agent with this email already exists' });
//     }

//     try { 
//       const saltRounds = 10; 
//       const hashedPassword = await bcrypt.hash(password, saltRounds);
//     // Create a new agent
//     const newAgent = new Agent({
//       name,
//       email,
//       password, // Ideally, the password should be hashed before saving
//       territoryHead,
//     });

//     const savedAgent = await newAgent.save();
//     res.status(201).json(savedAgent);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating agent', error: error.message });
//   }
// };

// // PUT to update an existing agent
// const updateAgent = async (req, res) => {
//   const { name, email, territoryHead } = req.body;

//   try {
//     const agent = await Agent.findById(req.params.id);
//     if (!agent) {
//       return res.status(404).json({ message: 'Agent not found' });
//     }

//     // Update agent details
//     agent.name = name || agent.name;
//     agent.email = email || agent.email;
//     agent.territoryHead = territoryHead || agent.territoryHead;

//     const updatedAgent = await agent.save();
//     res.status(200).json(updatedAgent);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating agent', error: error.message });
//   }
// };

// // DELETE an agent
// const deleteAgent = async (req, res) => {
//   try {
//     const agent = await Agent.findById(req.params.id);
//     if (!agent) {
//       return res.status(404).json({ message: 'Agent not found' });
//     }

//     await agent.remove();
//     res.status(200).json({ message: 'Agent deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting agent', error: error.message });
//   }
// };

// module.exports = {
//   getAllAgents,
//   getAgentById,
//   createAgent,
//   updateAgent,
//   deleteAgent,
// };

const express = require("express");
const router = express.Router();
const Agent = require("../models/Agent");
const Transaction = require("../models/Transaction");
const Payout = require("../models/Payout");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Register a New Agent
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { name, territoryHeadId, contactEmail, phone } = req.body;

    if (!name || !territoryHeadId || !contactEmail || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAgent = new Agent({
      name,
      territoryHeadId,
      contactEmail,
      phone,
    });

    await newAgent.save();
    res.json({ success: true, message: "Agent registered successfully" });
  } catch (error) {
    console.error("Agent Registration Error:", error);
    res.status(500).json({ message: "Error registering agent" });
  }
});

// ✅ Get All Agents
router.get("/", verifyToken, async (req, res) => {
  try {
    const agents = await Agent.find().populate("territoryHeadId", "name").sort({ createdAt: -1 });
    res.json({ success: true, data: agents });
  } catch (error) {
    console.error("Fetch Agents Error:", error);
    res.status(500).json({ message: "Error fetching agents" });
  }
});

// ✅ Get a Single Agent by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).populate("territoryHeadId", "name");

    if (!agent) return res.status(404).json({ message: "Agent not found" });

    res.json({ success: true, data: agent });
  } catch (error) {
    console.error("Fetch Agent Error:", error);
    res.status(500).json({ message: "Error fetching agent" });
  }
});

// ✅ Update Agent Information
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, contactEmail, phone } = req.body;
    const agent = await Agent.findById(req.params.id);

    if (!agent) return res.status(404).json({ message: "Agent not found" });

    agent.name = name || agent.name;
    agent.contactEmail = contactEmail || agent.contactEmail;
    agent.phone = phone || agent.phone;

    await agent.save();
    res.json({ success: true, message: "Agent updated successfully" });
  } catch (error) {
    console.error("Update Agent Error:", error);
    res.status(500).json({ message: "Error updating agent" });
  }
});

// ✅ Delete Agent
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Delete Agent Error:", error);
    res.status(500).json({ message: "Error deleting agent" });
  }
});

// ✅ Get Agent's Sales & Transactions
router.get("/:id/transactions", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ agentId: req.params.id }).sort({ createdAt: -1 });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Agent Transactions Error:", error);
    res.status(500).json({ message: "Error fetching agent transactions" });
  }
});

// ✅ Agent Payout Requests
router.post("/:id/payout-request", verifyToken, async (req, res) => {
  try {
    const { amount, method } = req.body;

    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" });
    }

    const payout = new Payout({
      userId: req.user.id,
      agentId: req.params.id,
      amount,
      method,
      status: "pending",
    });

    await payout.save();
    res.json({ success: true, message: "Agent payout request submitted." });
  } catch (error) {
    console.error("Agent Payout Request Error:", error);
    res.status(500).json({ message: "Error requesting payout" });
  }
});

module.exports = router;

