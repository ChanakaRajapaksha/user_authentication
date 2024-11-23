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
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
    },
});

const handleLogin = async (req, res) => {
    const { email, password, otp } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find the user in the database by email
        const foundUser = await prisma.user.findUnique({ where: { email } });

        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password.' }); // Unauthorized
        }

        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, foundUser.password);

        if (match) {
            // Check if OTP verification is required
            if (!otp) {
                // Generate an OTP and send it to the user's email
                const generatedOTP = generateOTP();
                const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

                // Store OTP in the database
                await prisma.otp.create({
                    data: {
                        userId: foundUser.id,
                        otp: generatedOTP,
                        expiresAt,
                    },
                });

                // Send OTP via email
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Your Login OTP',
                    text: `Your OTP is: ${generatedOTP}`,
                });

                // Inform the frontend that OTP is required
                return res.status(200).json({ message: 'OTP sent to your email address.', otpRequired: true });
            }

            // Verify the provided OTP
            const validOtp = await prisma.otp.findFirst({
                where: {
                    userId: foundUser.id,
                    otp,
                    expiresAt: { gte: new Date() }, // Ensure the OTP is not expired
                },
            });

            if (!validOtp) {
                return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
            }

            // Delete OTP after successful verification
            await prisma.otp.delete({
                where: { id: validOtp.id },
            });

            // OTP is valid, proceed with login
            // Generate access and refresh tokens
            const accessToken = jwt.sign(
                { userId: foundUser.id, email: foundUser.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );

            const refreshToken = jwt.sign(
                { userId: foundUser.id, email: foundUser.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );

            // Save the refresh token in the user record
            await prisma.user.update({
                where: { id: foundUser.id },
                data: { refreshToken },
            });

            // Set the refresh token in an HttpOnly cookie
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            // Return the access token and indicate no OTP is needed
            res.status(200).json({
                success: `User ${foundUser.email} is logged in!`,
                accessToken,
                otpRequired: false,
            });
        } else {
            res.status(401).json({ message: 'Unauthorized: Invalid email or password.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

module.exports = { handleLogin };
