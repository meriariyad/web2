import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check for existing username or email
    const existingUser = await User.findOne({
      $or: [
        { username: username.trim().toLowerCase() },
        { email: email.trim().toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.username.toLowerCase() === username.trim().toLowerCase()) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Check if this is the first user (make admin if so)
    const userCount = await User.countDocuments();
    const role = userCount === 0 || username.trim().toLowerCase() === 'admin' ? 'admin' : 'user';

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
      password,
      role
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password.' });
    }

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message || 'Server error during login.' });
  }
});

export default router;
