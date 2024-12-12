const prisma = require('../database/prismaClient');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { getNetworkDetails } = require('../utils/networkUtils');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const foundUser = await prisma.user.findFirst({ where: { email } });
        const foundMasterUser = await prisma.masterUser.findFirst({ where: { email } });

        if (!foundUser && !foundMasterUser) {
            return res.status(401).json({ message: "Unauthorized: Invalid email or password." });
        }

        let user, isMasterUser, match;
        if (foundMasterUser) {
            console.log("Master user login attempt detected.");
            isMasterUser = true;
            user = foundMasterUser;
            match = await bcrypt.compare(password, user.masterPassword || user.password);
        } else {
            console.log("Regular user login attempt detected.");
            isMasterUser = false;
            user = foundUser;
            match = await bcrypt.compare(password, user.password);
        }

        if (!match) {
            return res.status(401).json({ message: "Unauthorized: Invalid email or password." });
        }

        const roles = [user.role || (isMasterUser ? "masterUser" : "user")];
        const payload = {
            id: isMasterUser ? user.empId : user.id,
            email: user.email,
            roles,
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        // Store refresh token in the appropriate table
        if (isMasterUser) {
            await prisma.masterUser.update({
                where: { email },
                data: { refreshToken },
            });
        } else {
            await prisma.user.update({
                where: { email },
                data: { refreshToken },
            });
        }

        if (isMasterUser && user.masterPassword) {
            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
            await prisma.masterUser.update({
                where: { email },
                data: { resetToken, resetTokenExpiry },
            });

            // Attach refresh token for temporary password case
            res.cookie("jwt", refreshToken, {
                httpOnly: true,
                sameSite: "Strict",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                masterPassword: true,
                resetToken,
                roles,
                message: "Temporary password detected. Redirect to reset password.",
            });
        }

        const networkDetails = await getNetworkDetails();
        await prisma.networkLog.create({
            data: {
                userId: isMasterUser ? null : user.id,
                masterUserId: isMasterUser ? user.empId : null,
                publicIp: networkDetails.publicIp,
                localIp: networkDetails.localIp,
                macAddress: networkDetails.macAddress,
                username: networkDetails.username,
            },
        });

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "Strict",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: `${roles[0]} ${user.email} is logged in!`,
            accessToken,
            refreshToken,
            roles,
            username: user.username,
        });
    } catch (err) {
        console.error(`Error during login for email: ${email}`, err);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

module.exports = { handleLogin };