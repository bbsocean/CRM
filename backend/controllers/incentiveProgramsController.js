const express = require("express");
const router = express.Router();
const IncentiveProgram = require("../models/IncentiveProgram");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Create a New Incentive Program (Admin Only)
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, target, rewardAmount, applicableRoles, status } = req.body;

    if (!name || !description || !target || !rewardAmount || !applicableRoles.length) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newIncentive = new IncentiveProgram({
      name,
      description,
      target,
      rewardAmount,
      applicableRoles,
      status: status || "active",
    });

    await newIncentive.save();
    res.json({ success: true, message: "Incentive program created successfully.", data: newIncentive });
  } catch (error) {
    console.error("Incentive Program Creation Error:", error);
    res.status(500).json({ message: "Error creating incentive program." });
  }
});

// ✅ Get All Incentive Programs
router.get("/all", verifyToken, async (req, res) => {
  try {
    const incentives = await IncentiveProgram.find().sort({ createdAt: -1 });

    res.json({ success: true, data: incentives });
  } catch (error) {
    console.error("Fetch Incentive Programs Error:", error);
    res.status(500).json({ message: "Error fetching incentive programs." });
  }
});

// ✅ Get Incentive Programs for a Specific Role
router.get("/role/:role", verifyToken, async (req, res) => {
  try {
    const incentives = await IncentiveProgram.find({ applicableRoles: req.params.role });

    if (!incentives.length) return res.status(404).json({ message: "No incentive programs found for this role." });

    res.json({ success: true, data: incentives });
  } catch (error) {
    console.error("Fetch Role Incentive Programs Error:", error);
    res.status(500).json({ message: "Error fetching incentive programs for the role." });
  }
});

// ✅ Update Incentive Program (Admin Only)
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, description, target, rewardAmount, applicableRoles, status } = req.body;
    const incentive = await IncentiveProgram.findById(req.params.id);

    if (!incentive) return res.status(404).json({ message: "Incentive program not found." });

    incentive.name = name || incentive.name;
    incentive.description = description || incentive.description;
    incentive.target = target || incentive.target;
    incentive.rewardAmount = rewardAmount || incentive.rewardAmount;
    incentive.applicableRoles = applicableRoles || incentive.applicableRoles;
    incentive.status = status || incentive.status;

    await incentive.save();
    res.json({ success: true, message: "Incentive program updated successfully." });
  } catch (error) {
    console.error("Update Incentive Program Error:", error);
    res.status(500).json({ message: "Error updating incentive program." });
  }
});

// ✅ Delete Incentive Program (Admin Only)
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await IncentiveProgram.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Incentive program deleted successfully." });
  } catch (error) {
    console.error("Delete Incentive Program Error:", error);
    res.status(500).json({ message: "Error deleting incentive program." });
  }
});

module.exports = router;
