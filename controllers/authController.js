const prisma = require('../database/prismaClient'); // Import Prisma client
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

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

            // Return the access token in the response
            res.json({ success: `User ${foundUser.email} is logged in!`, accessToken });
        } else {
            res.status(401).json({ message: 'Unauthorized: Invalid email or password.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};


module.exports = { handleLogin };
