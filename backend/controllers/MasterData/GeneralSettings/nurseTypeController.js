const prisma = require("../../../database/prismaClient");

// Add New Nurse Type
const addNurseType = async (req, res) => {
    const { typeName, description } = req.body;

    if (!typeName) {
        return res.status(400).json({ error: "Nurse type is required" });
    }

    try {
        const newNurseType = await prisma.nurseType.create({
            data: {
                typeName,
                description,
            },
        });
        res.status(201).json(newNurseType);
    } catch (error) {
        res.status(500).json({ error: "Failed to add nurse type" });
    }
};

// Update Nurse Type
const updateNurseType = async (req, res) => {
    const { id } = req.params;
    const { typeName, description } = req.body;

    try {
        const updatedNurseType = await prisma.nurseType.update({
            where: { id: Number(id) },
            data: {
                typeName,
                description,
            },
        });
        res.json(updatedNurseType);
    } catch (error) {
        res.status(500).json({ error: "Failed to update nurse type" });
    }
};

// Delete Nurse Type
const deleteNurseType = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.nurseType.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Nurse type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete nurse type" });
    }
};

// Get All Nurse Types (Sorted by Name)
const getAllNurseTypes = async (req, res) => {
    try {
        const nurseTypes = await prisma.nurseType.findMany({
            orderBy: { typeName: "asc" },
        });
        res.json(nurseTypes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch nurse types" });
    }
};

module.exports = { addNurseType, updateNurseType, deleteNurseType, getAllNurseTypes };