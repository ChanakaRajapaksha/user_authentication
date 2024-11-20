const jwt = require('jsonwebtoken');
const prisma = require('../database/prismaClient'); // Import Prisma client

require('dotenv').config();

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.sendStatus(401); // Unauthorized if no token is provided

    const token = authHeader.split(' ')[1]; // Extract token from the header

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { email: decoded.email }, // Assuming email is encoded in the token
        });

        if (!user) return res.sendStatus(403); // Forbidden if user is not found

        // Attach user information to the request for downstream handlers
        req.user = { id: user.id, email: user.email, username: user.username };

        next(); // Pass control to the next middleware
    } catch (err) {
        console.error(err);
        return res.sendStatus(403); // Forbidden for invalid or expired token
    }
};

module.exports = verifyJWT;
