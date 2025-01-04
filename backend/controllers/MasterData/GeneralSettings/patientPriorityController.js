const prisma = require("../../../database/prismaClient");

// Add New Patient Priority
const addPatientPriority = async (req, res) => {
    const { priorityName, description } = req.body;

    if (!priorityName) {
        return res.status(400).json({ error: "Patient Priority is required" });
    }

    try {
        const newPriority = await prisma.patientPriority.create({
            data: {
                priorityName,
                description,
            },
        });
        res.status(201).json(newPriority);
    } catch (error) {
        res.status(500).json({ error: "Failed to add patient priority" });
    }
};

// Update Patient Priority
const updatePatientPriority = async (req, res) => {
    const { id } = req.params;
    const { priorityName, description } = req.body;

    try {
        const updatedPriority = await prisma.patientPriority.update({
            where: { id: Number(id) },
            data: {
                priorityName,
                description,
            },
        });
        res.json(updatedPriority);
    } catch (error) {
        res.status(500).json({ error: "Failed to update patient priority" });
    }
};

// Delete Patient Priority
const deletePatientPriority = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.patientPriority.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Patient priority deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete patient priority" });
    }
};

// Get All Patient Priorities (Sorted by Name)
const getAllPatientPriorities = async (req, res) => {
    try {
        const priorities = await prisma.patientPriority.findMany({
            orderBy: { priorityName: "asc" },
        });
        res.json(priorities);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch patient priorities" });
    }
};

module.exports = { addPatientPriority, updatePatientPriority, deletePatientPriority, getAllPatientPriorities };
