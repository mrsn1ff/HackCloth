// routes/orders.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
  try {
    const {
      shippingInfo,
      items,
      subtotal,
      shippingCharge,
      totalAmount,
      paymentMethod,
    } = req.body;
    const userId = req.user._id; // From auth middleware

    // Generate order ID
    const orderId = `ORD-${uuidv4().substr(0, 8).toUpperCase()}`;

    // Create order object
    const newOrder = {
      orderId,
      items,
      totalAmount,
      shippingCharge,
      subtotal,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    };

    // Update user with shipping info and add order
    await User.findByIdAndUpdate(userId, {
      $set: {
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        address: {
          street: shippingInfo.address,
          pincode: shippingInfo.pincode,
        },
      },
      $push: { orders: newOrder },
      $set: { cart: [] }, // Clear cart after order
    });

    res.status(201).json({
      success: true,
      orderId,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Order creation failed',
    });
  }
});

module.exports = router;
