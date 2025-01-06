const express = require('express');
const router = express.Router();

const verifyJWT = require('../middleware/verifyJWT');

const { handleNewUser } = require('../controllers/registerController');
const { handleLogin, updateBranch } = require('../controllers/authController');
const { handleRefreshToken } = require('../controllers/refreshTokenController');
const { handleLogout } = require('../controllers/logoutController');
const { handleForgotPassword } = require('../controllers/forgotPasswordController');
const { handleResetPassword } = require('../controllers/resetPasswordController');
const { handleVerifyOtp } = require('../controllers/verifyOTPController');

// Public Routes
router.post('/register', handleNewUser);
router.post('/login', handleLogin);
router.get('/refresh', handleRefreshToken);
router.get('/logout', handleLogout);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password/:token', handleResetPassword);
router.post('/verify-otp', handleVerifyOtp);

// Protected Route (requires auth)
router.post('/update-branch', verifyJWT, updateBranch);

module.exports = router;
