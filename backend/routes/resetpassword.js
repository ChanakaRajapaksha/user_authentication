const express = require('express');
const router = express.Router();

const { handleResetPassword } = require('../controllers/resetPasswordController');

router.post('/reset-password/:token', handleResetPassword);

module.exports = router;