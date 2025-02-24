const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ Assign a Role to a User (Admin Only)
router.post("/assign-role", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "User ID and role are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.role = role;
    await user.save();

    res.json({ success: true, message: `Role updated to ${role} for user.` });
  } catch (error) {
    console.error("Assign Role Error:", error);
    res.status(500).json({ message: "Error assigning role." });
  }
});

// ✅ Get All Users & Their Roles (Admin Only)
router.get("/all-users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("name email role");

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Fetch Users Roles Error:", error);
    res.status(500).json({ message: "Error fetching users and roles." });
  }
});

// ✅ Get User Role (For Individual Users)
router.get("/user-role", verifyToken, async (req, res) => {
  try {
    res.json({ success: true, role: req.user.role });
  } catch (error) {
    console.error("Fetch User Role Error:", error);
    res.status(500).json({ message: "Error fetching user role." });
  }
});

// ✅ Update User Permissions (Admin Only)
router.put("/update-permissions/:userId", verifyToken, isAdmin, async (req, res) => {
  try {
    const { permissions } = req.body;

    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Valid permissions array is required." });
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.permissions = permissions;
    await user.save();

    res.json({ success: true, message: "Permissions updated successfully." });
  } catch (error) {
    console.error("Update User Permissions Error:", error);
    res.status(500).json({ message: "Error updating user permissions." });
  }
});

// ✅ Remove User Role (Admin Only)
router.delete("/remove-role/:userId", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.role = "User"; // Default role
    await user.save();

    res.json({ success: true, message: "User role removed successfully." });
  } catch (error) {
    console.error("Remove User Role Error:", error);
    res.status(500).json({ message: "Error removing user role." });
  }
});

module.exports = router;
