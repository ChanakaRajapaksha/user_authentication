const jwt = require('jsonwebtoken');

const sessionTimeoutMinutes = 10; // Set your timeout
const sessionTimeoutSeconds = sessionTimeoutMinutes * 60; // Timeout in seconds

const withAuth = (prisma) => async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const refreshTokenCookie = req.cookies?.jwt;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (refreshTokenCookie) {
            // User has a cookie but no authorization header. This means an expired token but the session is not expired
            const decoded = jwt.decode(refreshTokenCookie, { complete: true });
            //Check to see if the token exists and not expired.
            if (decoded) {
                console.log("RefreshToken found but no access token. Check if session is expired")
                const userId = decoded.payload.id;
                const roles = decoded.payload.roles[0];

                let lastActivity;
                if (roles === 'masterUser') {
                    const foundMasterUser = await prisma.masterUser.findFirst({
                        where: { empId: userId },
                    });
                    lastActivity = foundMasterUser?.lastActivity?.getTime();
                } else {
                    const foundUser = await prisma.user.findFirst({
                        where: { id: userId },
                    });
                    lastActivity = foundUser?.lastActivity?.getTime();
                }

                const currentTime = Date.now();
                const timeDiff = (currentTime - lastActivity) / 1000;

                // If session has expired, clear the cookie and return unauthorized.
                if (lastActivity && timeDiff > sessionTimeoutSeconds) {
                    res.clearCookie("jwt", { httpOnly: true, sameSite: 'Strict', secure: true });
                    console.log('Session expired');
                    return res.status(401).json({ message: "Session timed out. Please log in again." });
                }

                if (lastActivity) {
                    // If no issue with the session continue with logic
                    let updatedUser;
                    const newLastActivity = new Date();
                    if (roles === 'masterUser') {
                        updatedUser = await prisma.masterUser.update({
                            where: { empId: userId },
                            data: { lastActivity: newLastActivity }
                        })
                    }
                    else {
                        updatedUser = await prisma.user.update({
                            where: { id: userId },
                            data: { lastActivity: newLastActivity }
                        })
                    }
                }
                req.userId = userId;
                req.userRoles = roles;
                return next();
            }
            // if the user has cookie but the cookie is invalid, clear the cookie
            res.clearCookie("jwt", { httpOnly: true, sameSite: 'Strict', secure: true });
            return res.status(401).json({ message: "Unauthorized: Session is expired or invalid." });
        }
        return res.status(401).json({ message: "Unauthorized: Access token is missing or invalid." });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Get last activity from the database
        let lastActivity;
        if (decoded.roles[0] === 'masterUser') {
            const foundMasterUser = await prisma.masterUser.findFirst({
                where: { empId: decoded.id },
            });
            lastActivity = foundMasterUser?.lastActivity?.getTime();
        } else {
            const foundUser = await prisma.user.findFirst({
                where: { id: decoded.id },
            });
            lastActivity = foundUser?.lastActivity?.getTime();
        }

        const currentTime = Date.now();
        const timeDiff = (currentTime - lastActivity) / 1000;

        // If session has expired, return unauthorized
        if (lastActivity && timeDiff > sessionTimeoutSeconds) {
            res.clearCookie("jwt", { httpOnly: true, sameSite: 'Strict', secure: true });
            return res.status(401).json({ message: "Session timed out. Please log in again." });
        }

        // If no issue with the session continue with logic
        let updatedUser;
        const newLastActivity = new Date();
        if (decoded.roles[0] === 'masterUser') {
            updatedUser = await prisma.masterUser.update({
                where: { empId: decoded.id },
                data: { lastActivity: newLastActivity }
            })
        }
        else {
            updatedUser = await prisma.user.update({
                where: { id: decoded.id },
                data: { lastActivity: newLastActivity }
            })
        }

        req.userId = decoded.id;
        req.userRoles = decoded.roles[0];
        next();
    } catch (err) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: 'Strict', secure: true });
        return res.status(401).json({ message: "Unauthorized: Session is expired or invalid." });
    }
};

module.exports = { withAuth };