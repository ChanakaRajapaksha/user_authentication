const jwt = require('jsonwebtoken');
const prisma = require('../database/prismaClient');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        console.error("No refresh token in cookies.");
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;
    console.log("Refresh Token from Cookie:", refreshToken);

    try {
        // Check refresh token for both users and master users
        const foundUser = await prisma.user.findFirst({ where: { refreshToken } });
        const foundMasterUser = await prisma.masterUser.findFirst({ where: { refreshToken } });

        if (!foundUser && !foundMasterUser) {
            console.error("No user or master user found with the given refresh token.");
            return res.sendStatus(403); // Forbidden
        }

        const user = foundUser || foundMasterUser; // Determine which user type matched
        const isMasterUser = !!foundMasterUser; // Boolean to indicate if master user
        const tokenSecret = process.env.REFRESH_TOKEN_SECRET;

        console.log(
            `Refresh Token from Database (${isMasterUser ? 'Master User' : 'User'}):`,
            user.refreshToken
        );

        // Verify the refresh token
        jwt.verify(refreshToken, tokenSecret, (err, decoded) => {
            if (err || user.username !== decoded.username) {
                console.error("JWT Verification Error or Username Mismatch:", err?.message);
                return res.sendStatus(403); // Forbidden
            }

            // Generate a new access token
            const roles = [user.role || (isMasterUser ? 'masterUser' : 'user')];
            const payload = {
                id: isMasterUser ? user.empId : user.id,
                username: user.username,
                roles,
            };

            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );

            console.log("New Access Token Generated:", accessToken);

            res.json({ accessToken, roles });
        });
    } catch (err) {
        console.error("Error in handleRefreshToken:", err.message);
        res.sendStatus(500); // Internal Server Error
    }
};

module.exports = { handleRefreshToken };