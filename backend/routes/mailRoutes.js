const express = require('express');
const router = express.Router();
const { sendTestEmail } = require('../controller/mailController');

// Send test email route
router.post('/send-test-email', sendTestEmail);

module.exports = router; 