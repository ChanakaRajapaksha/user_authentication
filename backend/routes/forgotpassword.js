const express = require('express');
const router = express.Router();

const { handleForgotPassword } = require('../controllers/forgotPasswordController');

router.post('/forgot-password', handleForgotPassword);

module.exports = router;