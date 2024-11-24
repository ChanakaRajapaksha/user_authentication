const jwt = require('jsonwebtoken');
const prisma = require('../database/prismaClient');

const handleVerifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        const foundUser = await prisma.user.findUnique({ where: { email } });

        if (!foundUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const foundOtp = await prisma.otp.findFirst({
            where: {
                userId: foundUser.id,
                otp,
                expiresAt: { gte: new Date() },
            },
        });

        if (!foundOtp) {
            return res.status(401).json({ message: 'Invalid or expired OTP.' });
        }

        await prisma.otp.delete({ where: { id: foundOtp.id } });

        const accessToken = jwt.sign(
            { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );

        const refreshToken = jwt.sign(
            { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        await prisma.user.update({
            where: { id: foundUser.id },
            data: { refreshToken },
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: `Doctor ${foundUser.email} is logged in!`,
            accessToken,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

module.exports = { handleVerifyOtp };
