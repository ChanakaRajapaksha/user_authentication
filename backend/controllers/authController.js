const prisma = require('../database/prismaClient');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { getNetworkDetails } = require('../utils/networkUtils');

const handleLogin = async (req, res) => {
    const { username: reqUsername, password } = req.body;

    if (!reqUsername || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const foundUser = await prisma.user.findFirst({ where: { username: reqUsername } });
        const foundMasterUser = await prisma.masterUser.findFirst({ where: { username: reqUsername } });

        if (!foundUser && !foundMasterUser) {
            return res.status(401).json({ message: "Unauthorized: Invalid username or password." });
        }

        if (foundMasterUser && foundMasterUser.status === "Inactive") {
            return res.status(403).json({ message: "Your account is inactive. Please contact the admin." });
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
            return res.status(401).json({ message: "Unauthorized: Invalid username or password." });
        }

        const roles = [user.role || (isMasterUser ? "masterUser" : "user")];
        const payload = {
            id: isMasterUser ? user.empId : user.id,
            username: user.username,
            roles,
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        if (isMasterUser) {
            await prisma.masterUser.update({
                where: { email: user.email },
                data: { refreshToken },
            });
        } else {
            await prisma.user.update({
                where: { username: reqUsername },
                data: { refreshToken },
            });
        }

        if (isMasterUser && user.masterPassword) {
            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
            await prisma.masterUser.update({
                where: { email: user.email },
                data: { resetToken, resetTokenExpiry },
            });

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
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: `${roles[0]} ${user.username} is logged in!`,
            accessToken,
            refreshToken,
            roles,
            username: user.username,
        });

    } catch (err) {
        console.error(`Error during login for username: ${reqUsername}`, err);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

const updateBranch = async (req, res) => {
    const { branch } = req.body;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized: Access token is missing." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let updatedUser;
        if (decoded.roles[0] === "masterUser") {
            updatedUser = await prisma.masterUser.update({
                where: { empId: decoded.id },
                data: { branch },
            });
        } else {
            updatedUser = await prisma.user.update({
                where: { id: decoded.id },
                data: { branch },
            });
        }

        // Create a new payload including the branch and basic user info
        const payload = {
            id: decoded.id,
            username: decoded.username,
            roles: decoded.roles,
            branch: updatedUser.branch,

        };
        //create a new access token
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

        res.status(200).json({ ...updatedUser, accessToken: accessToken });

    } catch (error) {
        console.error("Error updating branch: ", error);
        return res.status(500).json({ message: "Internal Server Error while updating the branch." });
    }
}


module.exports = { handleLogin, updateBranch };