const express = require('express');
const router = express.Router();
const { sendLoginCode } = require('../utils/emailHandler');
const { generateToken } = require('../utils/tokenHandler');
const EmailCode = require('../models/EmailCode');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User not found' });

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

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

// Get cart
router.get('/cart', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    res.json({ cart: user.cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

// Add/Update item in cart
router.post('/cart', authenticateUser, async (req, res) => {
  try {
    const { productId, name, price, image, quantity, size, color } = req.body;
    const user = await User.findById(req.user._id);

    // Validate all required fields
    if (
      !productId ||
      !name ||
      !price ||
      !image ||
      !quantity ||
      !size ||
      !color
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate quantity is a positive integer
    if (!Number.isInteger(quantity)) {
      return res.status(400).json({ message: 'Quantity must be an integer' });
    }

    // Find existing item
    const existingItemIndex = user.cart.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color,
    );

    if (existingItemIndex >= 0) {
      // Update quantity (replace, don't add)
      user.cart[existingItemIndex].quantity = Math.min(
        quantity,
        100, // Maximum limit
      );
    } else {
      // Add new item
      user.cart.push({
        productId: new mongoose.Types.ObjectId(productId),
        name,
        price,
        image,
        quantity: Math.min(quantity, 100),
        size,
        color,
        addedAt: new Date(),
      });
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

router.delete('/cart/:itemId', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const itemId = new mongoose.Types.ObjectId(req.params.itemId);

    const newCart = user.cart.filter((item) => !item._id.equals(itemId));

    if (newCart.length === user.cart.length) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    user.cart = newCart;
    await user.save();

    const updatedUser = await User.findById(user._id).lean();
    res.json({ cart: updatedUser.cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

module.exports = router;
