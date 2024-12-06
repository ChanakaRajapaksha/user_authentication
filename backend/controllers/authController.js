const prisma = require('../database/prismaClient'); // Import Prisma client
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getNetworkDetails } = require('../utils/networkUtils');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const foundUser = await prisma.user.findFirst({
            where: { email },
        });

        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password.' });
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({ message: 'Unauthorized: Invalid email or password.' });
        }

        const roles = [foundUser.role];
        const username = foundUser.username;

        const accessToken = jwt.sign(
            { userId: foundUser.id, email: foundUser.email, roles },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );

        const refreshToken = jwt.sign(
            { userId: foundUser.id, email: foundUser.email, roles },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        await prisma.user.update({
            where: { id: foundUser.id },
            data: { refreshToken },
        });

        // Fetch network details
        const networkDetails = await getNetworkDetails();

        // Save network details to the database
        await prisma.networkLog.create({
            data: {
                userId: foundUser.id,
                publicIp: networkDetails.publicIp,
                localIp: networkDetails.localIp,
                macAddress: networkDetails.macAddress,
                username: networkDetails.username,
            },
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: `${foundUser.role} ${foundUser.email} is logged in!`,
            accessToken,
            roles,
            username,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

module.exports = { handleLogin };
