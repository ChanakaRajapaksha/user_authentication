const prisma = require("../../../database/prismaClient");

// Get all schedule types
const getAllScheduleTypes = async (req, res) => {
    try {
        const scheduleTypes = await prisma.scheduleType.findMany();
        res.json(scheduleTypes);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve schedule types" });
    }
};

// Add a new schedule type
const addScheduleType = async (req, res) => {
    const { typeName, description } = req.body;

    if (!typeName || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newScheduleType = await prisma.scheduleType.create({
            data: {
                typeName,
                description,
            },
        });
        res.status(201).json(newScheduleType);
    } catch (error) {
        res.status(500).json({ error: "Failed to add schedule type" });
    }
};

// Get schedule type by ID
const getScheduleTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const scheduleType = await prisma.scheduleType.findUnique({
            where: { id: Number(id) },
        });
        if (!scheduleType) {
            return res.status(404).json({ error: "Schedule type not found" });
        }
        res.json(scheduleType);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch schedule type" });
    }
};

// Update schedule type
const updateScheduleType = async (req, res) => {
    const { id } = req.params;
    const { typeName, description } = req.body;

    try {
        const updatedScheduleType = await prisma.scheduleType.update({
            where: { id: Number(id) },
            data: {
                typeName,
                description,
            },
        });
        res.json(updatedScheduleType);
    } catch (error) {
        res.status(500).json({ error: "Failed to update schedule type" });
    }
};

// Delete schedule type
const deleteScheduleType = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.scheduleType.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Schedule type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete schedule type" });
    }
};

module.exports = {
    getAllScheduleTypes,
    addScheduleType,
    getScheduleTypeById,
    updateScheduleType,
    deleteScheduleType,
};