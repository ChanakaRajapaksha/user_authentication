const bcrypt = require('bcrypt');
const prisma = require('../database/prismaClient');

const handleResetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: "New password is required." });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });

        const masterUser = await prisma.masterUser.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });

        if (!user && !masterUser) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });
        }

        if (masterUser) {
            await prisma.masterUser.update({
                where: { id: masterUser.id },
                data: {
                    password: hashedPassword,
                    masterPassword: null,
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });
        }

        res.json({ message: "Password reset successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

module.exports = { handleResetPassword };