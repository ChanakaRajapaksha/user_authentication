const jwt = require('jsonwebtoken');
const prisma = require('../database/prismaClient'); // Import Prisma client
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    // Check if refresh token is present in cookies
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

    const refreshToken = cookies.jwt;

    try {
        // Find the user by the refresh token in the database
        const foundUser = await prisma.user.findFirst({
            where: { refreshToken }, // Use findFirst to search by non-unique field
        });

        if (!foundUser) return res.sendStatus(403); // Forbidden if no user matches the token

        // Verify the refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.email !== decoded.email) {
                    return res.sendStatus(403); // Forbidden for invalid or mismatched token
                }

                // Generate a new access token
                const accessToken = jwt.sign(
                    { email: decoded.email, username: foundUser.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' } // Adjust expiration as needed
                );

                res.json({ accessToken }); // Return the new access token
            }
        );
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal Server Error
    }
};

module.exports = { handleRefreshToken };
