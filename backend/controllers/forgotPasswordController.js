const crypto = require('crypto');
const prisma = require('../database/prismaClient');
const sendResetEmail = require('../utils/sendResetEmail');

const handleForgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Find the user, if they exist
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Generate a reset token and expiry
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
            await sendResetEmail(email, resetToken);
        }

        // Send a generic response regardless of user existence
        res.json({
            message: 'If this email is associated with an account, a password reset link has been sent.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { handleForgotPassword };
