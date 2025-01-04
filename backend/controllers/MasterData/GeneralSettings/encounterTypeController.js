const prisma = require("../../../database/prismaClient");

// Add New Encounter Type
const createEncounterType = async (req, res) => {
    const { encounterType, description } = req.body;

    if (!encounterType) {
        return res.status(400).json({ error: "Encounter type is required" });
    }

    try {
        const newEncounterType = await prisma.encounterType.create({
            data: {
                encounterType,
                description,
            },
        });
        res.status(201).json(newEncounterType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create encounter type" });
    }
};
// Get all Encounter Types
const getAllEncounterTypes = async (req, res) => {
    try {
        const encounterTypes = await prisma.encounterType.findMany();
        res.status(200).json(encounterTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch encounter types" });
    }
};

// Update Encounter Type
const updateEncounterType = async (req, res) => {
    const { id } = req.params;
    const { encounterType, description } = req.body;

    try {
        const updatedEncounterType = await prisma.encounterType.update({
            where: { id: parseInt(id) },
            data: {
                encounterType,
                description,
            },
        });
        res.status(200).json(updatedEncounterType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update encounter type" });
    }
};

// Delete Encounter Type
const deleteEncounterType = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.encounterType.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Encounter Type deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete encounter type" });
    }
};

module.exports = {
    createEncounterType,
    getAllEncounterTypes,
    updateEncounterType,
    deleteEncounterType
};

