const express = require('express');
const router = express.Router();

const { handleNewUser } = require('../controllers/registerController');
const { handleLogin } = require('../controllers/authController');
const { handleRefreshToken } = require('../controllers/refreshTokenController');
const { handleLogout } = require('../controllers/logoutController');
const { handleForgotPassword } = require('../controllers/forgotPasswordController');
const { handleResetPassword } = require('../controllers/resetPasswordController');
const { handleVerifyOtp } = require('../controllers/verifyOTPController');

router.post('/register', handleNewUser);
router.post('/login', handleLogin);
router.get('/refresh', handleRefreshToken);
router.get('/logout', handleLogout);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password/:token', handleResetPassword);
router.post('/verify-otp', handleVerifyOtp);

module.exports = router;
