const express = require("express");
const router = express.Router();
const Hierarchy = require("../models/Hierarchy");
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Create a New Hierarchy Entry
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, parentId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "User ID and role are required." });
    }

    const newHierarchy = new Hierarchy({
      userId,
      parentId: parentId || null, // Optional parent reference
      role,
    });

    await newHierarchy.save();
    res.json({ success: true, message: "Hierarchy entry created successfully." });
  } catch (error) {
    console.error("Hierarchy Creation Error:", error);
    res.status(500).json({ message: "Error creating hierarchy entry." });
  }
});

// ✅ Get Full Hierarchy for a User
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const userHierarchy = await Hierarchy.findOne({ userId: req.params.id }).populate("parentId", "name email role");

    if (!userHierarchy) return res.status(404).json({ message: "Hierarchy entry not found for this user." });

    res.json({ success: true, data: userHierarchy });
  } catch (error) {
    console.error("Fetch User Hierarchy Error:", error);
    res.status(500).json({ message: "Error fetching hierarchy entry." });
  }
});

// ✅ Get All Hierarchy Entries (Admin Only)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const allHierarchy = await Hierarchy.find().populate("userId", "name email role").populate("parentId", "name email role");

    res.json({ success: true, data: allHierarchy });
  } catch (error) {
    console.error("Fetch All Hierarchy Error:", error);
    res.status(500).json({ message: "Error fetching all hierarchy entries." });
  }
});

// ✅ Update a Hierarchy Entry
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { parentId, role } = req.body;
    const hierarchy = await Hierarchy.findById(req.params.id);

    if (!hierarchy) return res.status(404).json({ message: "Hierarchy entry not found." });

    hierarchy.parentId = parentId || hierarchy.parentId;
    hierarchy.role = role || hierarchy.role;

    await hierarchy.save();
    res.json({ success: true, message: "Hierarchy entry updated successfully." });
  } catch (error) {
    console.error("Hierarchy Update Error:", error);
    res.status(500).json({ message: "Error updating hierarchy entry." });
  }
});

// ✅ Delete a Hierarchy Entry (Admin Only)
router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Hierarchy.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Hierarchy entry deleted successfully." });
  } catch (error) {
    console.error("Delete Hierarchy Error:", error);
    res.status(500).json({ message: "Error deleting hierarchy entry." });
  }
});

module.exports = router;
