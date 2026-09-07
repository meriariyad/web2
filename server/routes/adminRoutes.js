import express from 'express';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Require auth and admin role for all routes in this router
router.use(protect, adminOnly);

// @route   GET /api/admin/users
// @desc    Get list of all registered users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    return res.json({
      success: true,
      users: users.map((u) => u.toSafeObject())
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    return res.status(500).json({ message: error.message || 'Server error fetching user directory.' });
  }
});

// @route   PUT /api/admin/reset-password
// @desc    Admin reset a user's password
router.put('/reset-password', async (req, res) => {
  try {
    const { targetUsername, newPassword } = req.body;

    if (!targetUsername || !newPassword) {
      return res.status(400).json({ message: 'Target username and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    const user = await User.findOne({ username: targetUsername.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Target user not found.' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: `Password for @${user.username} has been successfully reset.`
    });
  } catch (error) {
    console.error('Admin reset password error:', error);
    return res.status(500).json({ message: error.message || 'Server error resetting password.' });
  }
});

// @route   DELETE /api/admin/users/:username
// @desc    Admin delete a user
router.delete('/users/:username', async (req, res) => {
  try {
    const { username } = req.params;

    if (username.trim().toLowerCase() === req.user.username.toLowerCase()) {
      return res.status(400).json({ message: 'You cannot delete your own active administrator account.' });
    }

    const deleted = await User.findOneAndDelete({ username: username.trim().toLowerCase() });
    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      success: true,
      message: `User @${deleted.username} was permanently removed.`
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return res.status(500).json({ message: error.message || 'Server error deleting user.' });
  }
});

export default router;
