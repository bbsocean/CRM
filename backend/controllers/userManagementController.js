// controllers/userManagementController.js
const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const newUser = new User({ name, email, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
