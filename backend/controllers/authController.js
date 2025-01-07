const prisma = require('../database/prismaClient');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { getNetworkDetails } = require('../utils/networkUtils');

const loginAttempts = new Map(); // Map to track login attempts for each user

const handleLogin = async (req, res) => {
    const { username: reqUsername, password } = req.body;

    if (!reqUsername || !password) {
        console.log("Login failed: Username or password missing.");
        return res
            .status(400)
            .json({ message: "Username and password are required." });
    }

    try {
        console.log(`Login attempt by username: ${reqUsername}`);

        const foundUser = await prisma.user.findFirst({
            where: { username: reqUsername },
        });
        const foundMasterUser = await prisma.masterUser.findFirst({
            where: { username: reqUsername },
        });

        console.log("Found user: ", foundUser);
        console.log("Found master user: ", foundMasterUser);

        if (!foundUser && !foundMasterUser) {
            console.log(`Login failed: No user found for username: ${reqUsername}`);
            // Log failed attempt for non-existent users as well
            updateLoginAttempts(reqUsername, false);
            return res.status(401).json({ message: "Invalid username." });
        }
        let user, isMasterUser;

        if (foundMasterUser && foundMasterUser.status === "Inactive") {
            console.log(
                `Login failed: Inactive account for username: ${reqUsername}`
            );
            return res.status(403).json({
                message: "Your account is inactive. Please contact the admin.",
            });
        }

        if (foundMasterUser) {
            isMasterUser = true;
            user = foundMasterUser;
        } else {
            isMasterUser = false;
            user = foundUser;
        }

        // Check for blocked user
        const userIdentifier = isMasterUser ? user.email : user.username;
        let attemptsData = loginAttempts.get(userIdentifier) || {
            attempts: 0,
            blockedUntil: null,
        };

        if (attemptsData.blockedUntil && attemptsData.blockedUntil > new Date()) {
            console.log(`Login failed: Account blocked for username: ${reqUsername}`);
            const remainingTime = Math.ceil(
                (attemptsData.blockedUntil - new Date()) / 60000
            );

            return res.status(403).json({
                message: `The account has been blocked due to security reasons, please try again with the valid credentials after ${remainingTime} minutes.`,
                blocked: true,
            });
        }

        // Reset attempts if blocked time has expired
        if (attemptsData.blockedUntil && attemptsData.blockedUntil <= new Date()) {
            loginAttempts.set(userIdentifier, { attempts: 0, blockedUntil: null });
            attemptsData = { attempts: 0, blockedUntil: null };
        }

        let match;
        if (isMasterUser) {
            console.log("Master user login attempt detected.");

            if (!user.masterPassword && !user.password) {
                console.log(`No password set for master user: ${reqUsername}`);
                updateLoginAttempts(userIdentifier, false);
                return res
                    .status(401)
                    .json({ message: "Unauthorized: No password found for user." });
            }
            match = user.masterPassword
                ? await bcrypt.compare(password, user.masterPassword)
                : await bcrypt.compare(password, user.password);
        } else {
            console.log("Regular user login attempt detected.");
            if (!user.password) {
                console.log(`No password set for user: ${reqUsername}`);
                updateLoginAttempts(userIdentifier, false);
                return res
                    .status(401)
                    .json({ message: "Unauthorized: No password found for user." });
            }

            match = await bcrypt.compare(password, user.password);
        }

        if (!match) {
            console.log(
                `Login failed: Password mismatch for username: ${reqUsername}`
            );
            updateLoginAttempts(userIdentifier, false);
            return res.status(401).json({ message: "Invalid password." });
        }
        // Reset attempts on successful login
        loginAttempts.delete(userIdentifier);

        const roles = [user.role || (isMasterUser ? "masterUser" : "user")];
        const payload = {
            id: isMasterUser ? user.empId : user.id,
            username: user.username,
            roles,
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "10m",
        });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "7d",
        });

        console.log("User authenticated. Generating tokens...");

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

            console.log(
                `Temporary password detected for ${user.username}. Redirecting to reset password.`
            );

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

        console.log(`${roles[0]} ${user.username} successfully logged in.`);

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

const updateLoginAttempts = (userIdentifier, successfulLogin) => {
    const attemptsData = loginAttempts.get(userIdentifier) || {
        attempts: 0,
        blockedUntil: null,
    };
    if (successfulLogin) {
        loginAttempts.delete(userIdentifier);
        return;
    }
    attemptsData.attempts += 1;

    if (attemptsData.attempts >= 3) {
        attemptsData.blockedUntil = new Date(Date.now() + 5 * 60 * 1000); // Block for 5 minutes
        console.log(
            `User ${userIdentifier} blocked until ${attemptsData.blockedUntil}`
        );
    }
    loginAttempts.set(userIdentifier, attemptsData);
};

const updateBranch = async (req, res) => {
    const { branch } = req.body;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Unauthorized: Access token is missing." });
    }

    const token = authHeader.split(" ")[1];

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
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "10m",
        });

        res.status(200).json({ ...updatedUser, accessToken: accessToken });
    } catch (error) {
        console.error("Error updating branch: ", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error while updating the branch." });
    }
};

module.exports = { handleLogin, updateBranch };