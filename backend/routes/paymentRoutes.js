const express = require('express');
const router = express.Router();
const { initiateSTKPush, handleCallback, checkTransactionStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Trigger STK Push (Requires cashier login)
router.post('/stk-push', protect, initiateSTKPush);

// Active Status Query (Fallback if webhook fails)
router.post('/check-status', protect, checkTransactionStatus);

// Daraja API Webhook Callback (Publicly accessible)
router.post('/callback', handleCallback);

module.exports = router;
