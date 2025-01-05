const prisma = require("../../../database/prismaClient");

// Add New Session Timeout
const createSessionTimeout = async (req, res) => {
    const {
        minTimeoutValue,
        minTimeoutUnit,
        maxTimeoutValue,
        maxTimeoutUnit,
        isEnabled,
    } = req.body;

    try {
        const newSessionTimeout = await prisma.sessionTimeout.create({
            data: {
                minTimeoutValue,
                minTimeoutUnit,
                maxTimeoutValue,
                maxTimeoutUnit,
                isEnabled: isEnabled !== undefined ? isEnabled : true,
            },
        });
        res.status(201).json(newSessionTimeout);
    } catch (error) {
        console.error("Failed to create session timeout:", error);
        res.status(500).json({ error: "Failed to create session timeout" });
    }
};

// Get all Session Timeouts
const getAllSessionTimeouts = async (req, res) => {
    try {
        const sessionTimeouts = await prisma.sessionTimeout.findMany();
        res.status(200).json(sessionTimeouts);
    } catch (error) {
        console.error("Failed to fetch session timeouts:", error);
        res.status(500).json({ error: "Failed to fetch session timeouts" });
    }
};

// Get only enabled session timeouts
const getEnabledSessionTimeouts = async (req, res) => {
    try {
        const enabledTimeouts = await prisma.sessionTimeout.findMany({
            where: { isEnabled: true }
        });
        res.status(200).json(enabledTimeouts);
    } catch (error) {
        console.error("Failed to fetch enabled session timeouts:", error);
        res.status(500).json({ error: "Failed to fetch enabled session timeouts" });
    }
};

// Update Session Timeout
const updateSessionTimeout = async (req, res) => {
    const { id } = req.params;
    const {
        minTimeoutValue,
        minTimeoutUnit,
        maxTimeoutValue,
        maxTimeoutUnit,
    } = req.body;

    try {
        const updatedSessionTimeout = await prisma.sessionTimeout.update({
            where: { id: parseInt(id) },
            data: {
                minTimeoutValue,
                minTimeoutUnit,
                maxTimeoutValue,
                maxTimeoutUnit,
            },
        });
        res.status(200).json(updatedSessionTimeout);
    } catch (error) {
        console.error("Failed to update session timeout:", error);
        res.status(500).json({ error: "Failed to update session timeout" });
    }
};

// Enable and disable Session Timeout
const toggleSessionTimeoutStatus = async (req, res) => {
    const { id } = req.params;
    const { isEnabled } = req.body;  

    try {
        const updatedTimeout = await prisma.sessionTimeout.update({
            where: { id: parseInt(id) },
            data: { isEnabled },
        });

        const message = isEnabled
            ? "Session timeout enabled successfully"
            : "Session timeout disabled successfully";

        res.status(200).json({ message, updatedTimeout });
    } catch (error) {
        console.error("Failed to update session timeout status:", error);
        res.status(500).json({ error: "Failed to update session timeout status" });
    }
};

// Delete Session Timeout
const deleteSessionTimeout = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.sessionTimeout.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Session timeout deleted successfully" });
    } catch (error) {
        console.error("Failed to delete session timeout:", error);
        res.status(500).json({ error: "Failed to delete session timeout" });
    }
};

module.exports = {
    createSessionTimeout,
    getAllSessionTimeouts,
    getEnabledSessionTimeouts,
    updateSessionTimeout,
    toggleSessionTimeoutStatus,
    deleteSessionTimeout
};