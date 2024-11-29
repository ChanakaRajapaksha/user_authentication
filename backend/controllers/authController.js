const prisma = require('../database/prismaClient'); // Import Prisma client
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();

// Function to generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Nodemailer configuration for sending OTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
    },
});

const handleLogin = async (req, res) => {
    const { email, password, username, otp } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by email and branch
        const foundUser = await prisma.user.findFirst({
            where: { email },
        });

        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password.' });
        }

        // Validate password
        const match = await bcrypt.compare(password, foundUser.password);

        if (!match) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password.' });
        }

        // Ensure roles are always returned as an array
        const roles = [foundUser.role];
        const username = foundUser.username;

        // Admins skip OTP and log in directly
        if (foundUser.role === 'admin') {
            const accessToken = jwt.sign(
                { userId: foundUser.id, email: foundUser.email, roles },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );

            const refreshToken = jwt.sign(
                { userId: foundUser.id, email: foundUser.email, roles },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );

            // Save refresh token in the database
            await prisma.user.update({
                where: { id: foundUser.id },
                data: { refreshToken },
            });

            // Set secure HTTP-only cookie for the refresh token
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: `Admin ${foundUser.email} is logged in!`,
                accessToken,
                roles,
                username,
                otpRequired: false,
            });
        }

        // Non-admin users require OTP verification
        if (!otp) {
            const generatedOTP = generateOTP();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

            // Save OTP in the database
            await prisma.otp.create({
                data: {
                    userId: foundUser.id,
                    otp: generatedOTP,
                    expiresAt,
                },
            });

            // Send OTP to the user's email
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Login OTP',
                text: `Your OTP is: ${generatedOTP}`,
            });

            return res.status(200).json({ message: 'OTP sent to your email address.', otpRequired: true });
        }

        // If OTP is provided, delegate verification to the OTP handler
        res.status(400).json({ message: 'OTP verification required in a separate request.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

module.exports = { handleLogin };
