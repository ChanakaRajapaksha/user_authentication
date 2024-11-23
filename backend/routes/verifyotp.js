const express = require('express');
const router = express.Router();

const { handleVerifyOtp } = require('../controllers/verifyOTPController');

router.post('/verify-otp', handleVerifyOtp);

module.exports = router;