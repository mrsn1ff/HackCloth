const express = require('express');
const router = express.Router();
const { sendLoginCode } = require('../utils/emailHandler');

router.get('/test-email', async (req, res) => {
  try {
    await sendLoginCode('your_test_email@example.com', '123456');
    res.send('Test email sent successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).send('Email test failed');
  }
});

module.exports = router;
