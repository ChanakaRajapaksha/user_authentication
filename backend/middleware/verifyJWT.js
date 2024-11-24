const jwt = require('jsonwebtoken');
const prisma = require('../database/prismaClient'); // Import Prisma client

require('dotenv').config();

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.status(401).json({ message: 'Unauthorized: No token provided.' }); // Unauthorized if no token

    const token = authHeader.split(' ')[1]; // Extract token from the header

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { email: decoded.email }, // Assuming email is encoded in the token
        });

        if (!user) {
            return res.status(403).json({ message: 'Forbidden: User not found.' }); // Forbidden if user not found
        }

        // Attach user information to the request for downstream handlers
        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role, // Add role for role-based authorization
        };

        next(); // Pass control to the next middleware
    } catch (err) {
        console.error('Error verifying JWT:', err.message);
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' }); // Forbidden for invalid or expired token
    }
};

module.exports = verifyJWT;
