const jwt = require('jsonwebtoken');
const prisma = require('../database/prismaClient');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        console.error("No refresh token in cookies.");
        return res.sendStatus(401); // Unauthorized
    }

    const refreshToken = cookies.jwt;
    console.log("Refresh Token from Cookie:", refreshToken);

    try {
        const foundUser = await prisma.user.findFirst({
            where: { refreshToken },
        });

        if (!foundUser) {
            console.error("No user found with the given refresh token.");
            return res.sendStatus(403); // Forbidden
        }

        console.log("Refresh Token from Database:", foundUser.refreshToken);

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.email !== decoded.email) {
                    console.error("JWT Verification Error or Email Mismatch:", err?.message);
                    return res.sendStatus(403); // Forbidden
                }

                // Generate a new access token
                const accessToken = jwt.sign(
                    { email: decoded.email, username: foundUser.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );

                console.log("New Access Token Generated:", accessToken);
                res.json({ accessToken });
            }
        );
    } catch (err) {
        console.error("Error in handleRefreshToken:", err.message);
        res.sendStatus(500); // Internal Server Error
    }
};

module.exports = { handleRefreshToken };
