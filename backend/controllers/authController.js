// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { validationResult } = require('express-validator');


// // Generate Access and Refresh tokens
// exports.loginUser = async (req, res) => {
//   try {
//     const { userId, email, role } = req.user;

//     // Generate access token (short-lived)
//     const accessToken = jwt.sign(
//       { userId, email, role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }  // Short expiration for access token
//     );

//     // Generate refresh token (long-lived)
//     const refreshToken = jwt.sign(
//       { userId, email, role },
//       process.env.REFRESH_TOKEN_SECRET,
//       { expiresIn: '7d' }  // Longer expiration for refresh token
//     );

//     // Store the refresh token in the database (or send it as a cookie)
//     await User.findByIdAndUpdate(userId, { refreshToken });

//     res.status(200).json({
//       accessToken,
//       refreshToken,
//       message: 'Login successful',
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };


// // Secure token expiration configuration
// const TOKEN_EXPIRATION = '1h';
// const REFRESH_TOKEN_EXPIRATION = '7d';

// // Registration controller with secure password hashing
// exports.registerUser = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, email, password } = req.body;

//   try {
//     // Check if the email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: 'User with this email already exists.' });
//     }

//     // Hash the password with bcrypt
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create a new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully.' });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// };

// // Login controller with token generation
// exports.loginUser = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }

//     // Compare provided password with stored hash
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: TOKEN_EXPIRATION,
//     });

//     // Optionally generate a refresh token (future-proof for token rotations)
//     const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: REFRESH_TOKEN_EXPIRATION,
//     });

//     res.status(200).json({
//       message: 'Login successful.',
//       token,
//       refreshToken,  // Include this if token rotation is needed
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// };


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ------------------ Signup Controller ------------------
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // Optional field to assign roles (Agent, Franchise, etc.)
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ------------------ Login Controller ------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ accessToken, refreshToken, role: user.role, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ------------------ Refresh Access Token Controller ------------------
exports.refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token is required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user and check if the refresh token matches
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid or tampered refresh token' });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token', error });
  }
};

// ------------------ Logout Controller (Added) ------------------
exports.logoutUser = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find user and clear their refresh token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.refreshToken = null;  // Clear the refresh token to invalidate it
    await user.save();

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ------------------ Forgot Password Controller (Added) ------------------
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a temporary reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.RESET_PASSWORD_SECRET,
      { expiresIn: '1h' }
    );

    // Send reset token via email (this is a placeholder, use an email service) 
    console.log('Reset Token:', resetToken);

    // Ideally, send the token via email (Skipped implementation here)
    res.status(200).json({ message: 'Reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ------------------ Reset Password Controller (Added) ------------------
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

//-----------------------------Forget User ID controller----------------------------------
exports.forgotUserID = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `Your user ID is: ${user._id}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
