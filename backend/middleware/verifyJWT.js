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

        const user = decoded.roles.includes('masterUser')
            ? await prisma.masterUser.findUnique({ where: { empId: String(decoded.id) } })
            : await prisma.user.findUnique({ where: { username: decoded.username } });

        console.log('Fetched User:', user);

        if (!user) {
            console.log('User not found.');
            return res.status(403).json({ message: 'Forbidden: User not found.' });
        }

        req.user = {
            id: user.id || user.empId,
            username: user.username,
            role: user.role,
            branch: user.branch,
            type: decoded.roles.includes('masterUser') ? 'masterUser' : 'user',
        };

        next();
    } catch (err) {
        console.error('Error verifying JWT:', err.message);
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }
};

module.exports = verifyJWT;
