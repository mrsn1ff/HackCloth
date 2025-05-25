const express = require('express');
const router = express.Router();
const { sendLoginCode } = require('../utils/emailHandler');
const { generateToken } = require('../utils/tokenHandler');
const EmailCode = require('../models/EmailCode');
const User = require('../models/User');

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Send login code
router.post('/send-login-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email',
      });
    }

    // Delete old codes
    await EmailCode.deleteMany({ email });

    const code = generateCode();
    const expiresAt = new Date(
      Date.now() + process.env.CODE_EXPIRATION_MINUTES * 60 * 1000,
    );

    await EmailCode.create({ email, code, expiresAt });
    await sendLoginCode(email, code);

    res.json({
      success: true,
      message: 'Code sent successfully',
    });
  } catch (error) {
    console.error('Send code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send code. Please try again.',
    });
  }
});

// Verify code
router.post('/verify-email-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    // 1. Validate code exists and matches
    const emailCode = await EmailCode.findOne({ email });
    if (!emailCode) {
      return res.status(400).json({
        success: false,
        message: 'No code found for this email',
      });
    }

    if (emailCode.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid code',
      });
    }

    if (new Date() > emailCode.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Code has expired',
      });
    }

    // 2. Find or create user
    let user = await User.findOne({ email });
    const isNewUser = !user;

    if (isNewUser) {
      user = await User.create({ email });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    // 3. Cleanup and respond
    await EmailCode.deleteOne({ email });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        isNewUser,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed. Please try again.',
    });
  }
});

module.exports = router;
