import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes here require authentication
router.use(protect);

// @route   GET /api/users/me
// @desc    Get current user profile
router.get('/me', async (req, res) => {
  return res.json({
    success: true,
    user: req.user.toSafeObject()
  });
});

// @route   PUT /api/users/profile
// @desc    Update personal information
router.post('/profile', async (req, res) => {
  // Allow POST or PUT
  return handleUpdateProfile(req, res);
});
router.put('/profile', async (req, res) => {
  return handleUpdateProfile(req, res);
});

async function handleUpdateProfile(req, res) {
  try {
    const { fullName, email, username } = req.body;

    if (!fullName || !email || !username) {
      return res.status(400).json({ message: 'Full name, email, and username are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }

    // If changing username or email, verify uniqueness
    const userToUpdate = await User.findById(req.user._id);

    if (username.trim().toLowerCase() !== userToUpdate.username.toLowerCase()) {
      const usernameExists = await User.findOne({ username: username.trim().toLowerCase() });
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
    }

    if (email.trim().toLowerCase() !== userToUpdate.email.toLowerCase()) {
      const emailExists = await User.findOne({ email: email.trim().toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ message: 'Email address is already in use.' });
      }
    }

    userToUpdate.fullName = fullName.trim();
    userToUpdate.email = email.trim().toLowerCase();
    userToUpdate.username = username.trim().toLowerCase();

    await userToUpdate.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: userToUpdate.toSafeObject()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: error.message || 'Server error updating profile.' });
  }
}

// @route   PUT /api/users/change-password
// @desc    Change user's own password
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password does not match.' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: 'Password updated successfully!',
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: error.message || 'Server error changing password.' });
  }
});

// @route   DELETE /api/users/me
// @desc    Delete user's own account
router.delete('/me', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    return res.json({
      success: true,
      message: 'Account permanently deleted.'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ message: error.message || 'Server error deleting account.' });
  }
});

export default router;
