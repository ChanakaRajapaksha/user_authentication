const crypto = require('crypto');
const prisma = require('../database/prismaClient');
const sendResetEmail = require('../utils/sendResetEmail');

const handleForgotPassword = async (req, res) => {
    const { email: username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.user.update({
            where: { username },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        await sendResetEmail(user.username, user.email, resetToken);

        res.json({ message: 'Password reset email sent.', email: user.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { handleForgotPassword };