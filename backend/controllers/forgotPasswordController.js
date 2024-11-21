const express = require('express');
const crypto = require('crypto');
const prisma = require('../database/prismaClient');
const sendResetEmail = require('../utils/sendResetEmail');

const handleForgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Find the user
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // Token valid for 1 hour

        // Save the token and expiry in the database
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // Send the reset email
        await sendResetEmail(user.email, resetToken);

        res.json({ message: 'Password reset email sent.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { handleForgotPassword };
