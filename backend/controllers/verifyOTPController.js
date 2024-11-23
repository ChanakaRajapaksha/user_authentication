const jwt = require('jsonwebtoken');
const prisma = require('../database/prismaClient');

const handleVerifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        // Find the user in the database
        const foundUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Find the OTP for the user
        const foundOtp = await prisma.otp.findFirst({
            where: {
                userId: foundUser.id,
                otp,
                expiresAt: { gte: new Date() }, // Ensure the OTP is not expired
            },
        });

        if (!foundOtp) {
            return res.status(401).json({ message: 'Invalid or expired OTP.' });
        }

        // Delete the OTP after successful verification
        await prisma.otp.delete({
            where: { id: foundOtp.id },
        });

        // Generate tokens
        const accessToken = jwt.sign({ userId: foundUser.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30s',
        });

        const refreshToken = jwt.sign({ userId: foundUser.id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        });

        await prisma.user.update({
            where: { id: foundUser.id },
            data: { refreshToken },
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ success: `User ${foundUser.email} is logged in!`, accessToken });
    } catch (err) {
        console.error('Error in OTP verification:', err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

module.exports = { handleVerifyOtp };
