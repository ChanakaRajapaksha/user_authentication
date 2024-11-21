const prisma = require('../database/prismaClient'); // Import Prisma client

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;

    // Check if the JWT cookie exists
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;

    try {
        // Check if refreshToken exists in the database
        const foundUser = await prisma.user.findFirst({
            where: {
                refreshToken: refreshToken,
            },
        });

        if (!foundUser) {
            // If no user found, clear the cookie and return 204
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: true });
            return res.sendStatus(204); // No content
        }

        // Remove the refresh token from the user's record
        await prisma.user.update({
            where: {
                id: foundUser.id,
            },
            data: {
                refreshToken: null, // Clear the refresh token
            },
        });

        // Clear the cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: true });
        res.sendStatus(204); // No content
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Internal server error
    }
};

module.exports = { handleLogout };
