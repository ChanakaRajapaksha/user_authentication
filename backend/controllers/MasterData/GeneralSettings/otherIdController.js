const prisma = require("../../../database/prismaClient");

// Add New Other ID Type
const createOtherID = async (req, res) => {
    const { otherId, description } = req.body;

    if (!otherId) {
        return res.status(400).json({ error: "Other Id type is required" });
    }

    try {
        const newOtherID = await prisma.otherID.create({
            data: {
                otherId,
                description,
            },
        });
        res.status(201).json(newOtherID);
    } catch (error) {
        console.error("Failed to create Other ID:", error);
        res.status(500).json({ error: "Failed to create Other ID" });
    }
};

// Get all Other IDs
const getAllOtherIDs = async (req, res) => {
    try {
        const otherIDs = await prisma.otherID.findMany();
        res.status(200).json(otherIDs);
    } catch (error) {
        console.error("Failed to fetch Other IDs:", error);
        res.status(500).json({ error: "Failed to fetch Other IDs" });
    }
};

// Update Other Id Type
const updateOtherID = async (req, res) => {
    const { id } = req.params;
    const { otherId, description } = req.body;

    try {
        const updatedOtherID = await prisma.otherID.update({
            where: { id: parseInt(id) },
            data: {
                otherId,
                description,
            },
        });
        res.status(200).json(updatedOtherID);
    } catch (error) {
        console.error("Failed to update Other ID:", error);
        res.status(500).json({ error: "Failed to update Other ID" });
    }
};

// Delete Other ID Type
const deleteOtherID = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.otherID.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Other ID deleted successfully" });
    } catch (error) {
        console.error("Failed to delete Other ID:", error);
        res.status(500).json({ error: "Failed to delete Other ID" });
    }
};

module.exports = {
    createOtherID,
    getAllOtherIDs,
    updateOtherID,
    deleteOtherID
};