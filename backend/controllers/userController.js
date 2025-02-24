const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ✅ User Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("User Registration Error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// ✅ User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token, user });
  } catch (error) {
    console.error("User Login Error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// ✅ Get All Users (Admin Only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ Update User Profile
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// ✅ Delete User (Admin Only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
