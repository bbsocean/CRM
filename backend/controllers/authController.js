const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');


// Generate Access and Refresh tokens
exports.loginUser = async (req, res) => {
  try {
    const { userId, email, role } = req.user;

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Short expiration for access token
    );

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }  // Longer expiration for refresh token
    );

    // Store the refresh token in the database (or send it as a cookie)
    await User.findByIdAndUpdate(userId, { refreshToken });

    res.status(200).json({
      accessToken,
      refreshToken,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};


// Secure token expiration configuration
const TOKEN_EXPIRATION = '1h';
const REFRESH_TOKEN_EXPIRATION = '7d';

// Registration controller with secure password hashing
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Login controller with token generation
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });

    // Optionally generate a refresh token (future-proof for token rotations)
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });

    res.status(200).json({
      message: 'Login successful.',
      token,
      refreshToken,  // Include this if token rotation is needed
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
