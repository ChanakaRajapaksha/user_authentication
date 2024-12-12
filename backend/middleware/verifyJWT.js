const jwt = require('jsonwebtoken');
const prisma = require('../database/prismaClient');

require('dotenv').config();

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.log('Authorization header missing.');
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('Decoded Token:', decoded);

        // Check both User and masterUser tables
        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
        });

        const masterUser = await prisma.masterUser.findUnique({
            where: { email: decoded.email },
        });

        console.log('User from User table:', user);
        console.log('User from masterUser table:', masterUser);

        // If neither a regular user nor a master user is found
        if (!user && !masterUser) {
            console.log('User not found for email:', decoded.email);
            return res.status(403).json({ message: 'Forbidden: User not found.' });
        }

        // Determine which user type and set role and permissions
        if (user) {
            req.user = {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                branch: user.branch,
                type: 'user',
            };
        } else if (masterUser) {
            req.user = {
                id: masterUser.id,
                email: masterUser.email,
                empId: masterUser.empId,
                role: masterUser.role,
                branch: masterUser.branch,
                status: masterUser.status,
                type: 'masterUser',
            };
        }

        next(); // Pass control to the next middleware
    } catch (err) {
        console.error('Error verifying JWT:', err.message);
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }
};

module.exports = verifyJWT;
