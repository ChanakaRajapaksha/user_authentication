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

        let user = null;
        let masterUser = null;

        if (decoded.id) {
            user = await prisma.user.findUnique({
                where: { username: decoded.username },
            });
        }

        if (decoded.id) {
            masterUser = await prisma.masterUser.findUnique({
                where: { empId: String(decoded.id) }, // Convert to string to match schema type
            });
        }

        console.log('User from User table:', user);
        console.log('User from MasterUser table:', masterUser);

        if (!user && !masterUser) {
            console.log('User not found.');
            return res.status(403).json({ message: 'Forbidden: User not found.' });
        }

        if (user) {
            req.user = {
                id: user.id,
                username: user.username,
                role: user.role,
                branch: user.branch,
                type: 'user',
            };
        } else if (masterUser) {
            req.user = {
                id: masterUser.id,
                empId: masterUser.empId,
                username: masterUser.username,
                role: masterUser.role,
                branch: masterUser.branch,
                status: masterUser.status,
                type: 'masterUser',
            };
        }

        next();
    } catch (err) {
        console.error('Error verifying JWT:', err.message);
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }
};

module.exports = verifyJWT;