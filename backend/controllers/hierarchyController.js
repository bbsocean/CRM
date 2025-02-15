const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Hierarchy = require("../models/Hierarchy");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Assign a User to a Hierarchy Role
router.post("/assign", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, role, parentId } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "User ID and role are required" });
    }

    const newHierarchy = new Hierarchy({
      userId,
      role,
      parentId: parentId || null, // parentId is optional
    });

    await newHierarchy.save();
    res.json({ success: true, message: "User assigned to hierarchy successfully." });
  } catch (error) {
    console.error("Hierarchy Assignment Error:", error);
    res.status(500).json({ message: "Error assigning user to hierarchy." });
  }
});

// ✅ Get Entire Hierarchy
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const hierarchy = await Hierarchy.find()
      .populate("userId", "name email role")
      .populate("parentId", "name email role");

    res.json({ success: true, data: hierarchy });
  } catch (error) {
    console.error("Fetch Hierarchy Error:", error);
    res.status(500).json({ message: "Error fetching hierarchy." });
  }
});

// ✅ Get a User's Hierarchy Position
router.get("/user/:id", verifyToken, async (req, res) => {
  try {
    const hierarchy = await Hierarchy.findOne({ userId: req.params.id }).populate("parentId", "name role");

    if (!hierarchy) return res.status(404).json({ message: "User not found in hierarchy" });

    res.json({ success: true, data: hierarchy });
  } catch (error) {
    console.error("Fetch User Hierarchy Error:", error);
    res.status(500).json({ message: "Error fetching user's hierarchy data." });
  }
});

// ✅ Get Subordinates of a User
router.get("/subordinates/:id", verifyToken, async (req, res) => {
  try {
    const subordinates = await Hierarchy.find({ parentId: req.params.id }).populate("userId", "name email role");

    res.json({ success: true, data: subordinates });
  } catch (error) {
    console.error("Fetch Subordinates Error:", error);
    res.status(500).json({ message: "Error fetching subordinates." });
  }
});

// ✅ Update a User's Role in Hierarchy (Admin Only)
router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { role, parentId } = req.body;

    const hierarchy = await Hierarchy.findById(req.params.id);

    if (!hierarchy) return res.status(404).json({ message: "User not found in hierarchy" });

    hierarchy.role = role || hierarchy.role;
    hierarchy.parentId = parentId || hierarchy.parentId;

    await hierarchy.save();
    res.json({ success: true, message: "Hierarchy updated successfully." });
  } catch (error) {
    console.error("Hierarchy Update Error:", error);
    res.status(500).json({ message: "Error updating hierarchy." });
  }
});

// ✅ Remove a User from Hierarchy (Admin Only)
router.delete("/remove/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Hierarchy.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User removed from hierarchy." });
  } catch (error) {
    console.error("Delete Hierarchy Entry Error:", error);
    res.status(500).json({ message: "Error removing user from hierarchy." });
  }
});

module.exports = router;
