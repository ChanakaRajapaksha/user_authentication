const prisma = require("../../../database/prismaClient");

// Get All Call Status
const getAllCallStatus = async (req, res) => {
    try {
        const callStatuses = await prisma.callStatus.findMany();
        res.json(callStatuses);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch call statuses" });
    }
};

// Add Call Status
const addCallStatus = async (req, res) => {
    const { status, description } = req.body;
    try {
        const newStatus = await prisma.callStatus.create({
            data: { status, description },
        });
        res.json(newStatus);
    } catch (error) {
        res.status(500).json({ error: "Failed to add call status" });
    }
};

// Update Call Status
const updateCallStatus = async (req, res) => {
    const { id } = req.params;
    const { status, description } = req.body;

    try {
        const updatedCallStatus = await prisma.callStatus.update({
            where: { id: Number(id) },
            data: {
                status,
                description,
            },
        });
        res.json(updatedCallStatus);
    } catch (error) {
        res.status(500).json({ error: "Failed to update call status" });
    }
};

// Remove Call Status
const removeCallStatus = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.callStatus.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Call status removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove call status" });
    }
};

module.exports = {
    getAllCallStatus,
    addCallStatus,
    updateCallStatus,
    removeCallStatus,
};