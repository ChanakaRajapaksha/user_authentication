const prisma = require("../../../database/prismaClient");

// Get all statuses
const getAllStatuses = async (req, res) => {
    try {
        const statuses = await prisma.appointmentStatus.findMany();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve statuses" });
    }
};

// Add a new status
const addStatus = async (req, res) => {
    const { statusName, description } = req.body;

    if (!statusName || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newStatus = await prisma.appointmentStatus.create({
            data: {
                statusName,
                description,
            },
        });
        res.status(201).json(newStatus);
    } catch (error) {
        res.status(500).json({ error: "Failed to add status" });
    }
};

// Get status by ID
const getStatusById = async (req, res) => {
    const { id } = req.params;
    try {
        const status = await prisma.appointmentStatus.findUnique({
            where: { id: Number(id) },
        });
        if (!status) {
            return res.status(404).json({ error: "Status not found" });
        }
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch status" });
    }
};

// Update status
const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { statusName, description } = req.body;

    try {
        const updatedStatus = await prisma.appointmentStatus.update({
            where: { id: Number(id) },
            data: {
                statusName,
                description,
            },
        });
        res.json(updatedStatus);
    } catch (error) {
        res.status(500).json({ error: "Failed to update status" });
    }
};

// Delete status
const deleteStatus = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.appointmentStatus.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Status deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete status" });
    }
};

module.exports = {
    getAllStatuses,
    addStatus,
    getStatusById,
    updateStatus,
    deleteStatus,
};