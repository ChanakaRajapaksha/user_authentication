const prisma = require("../../../database/prismaClient");

// Add New Block Type
const createBlockType = async (req, res) => {
    const { blockType, description } = req.body;

    if (!blockType) {
        return res.status(400).json({ error: "Block type is required" });
    }

    try {
        const newBlockType = await prisma.blockType.create({
            data: {
                blockType,
                description,
            },
        });
        res.status(201).json(newBlockType);
    } catch (error) {
        console.error("Failed to create Block Type:", error);
        res.status(500).json({ error: "Failed to create Block Type" });
    }
};

// Get all Block Types
const getAllBlockTypes = async (req, res) => {
    try {
        const blockTypes = await prisma.blockType.findMany({
            orderBy: { blockType: "asc" },
        });
        res.status(200).json(blockTypes);
    } catch (error) {
        console.error("Failed to fetch Block Types:", error);
        res.status(500).json({ error: "Failed to fetch Block Types" });
    }
};

// Update Block Type
const updateBlockType = async (req, res) => {
    const { id } = req.params;
    const { blockType, description } = req.body;

    try {
        const updatedBlockType = await prisma.blockType.update({
            where: { id: parseInt(id) },
            data: {
                blockType,
                description,
            },
        });
        res.status(200).json(updatedBlockType);
    } catch (error) {
        console.error("Failed to update Block Type:", error);
        res.status(500).json({ error: "Failed to update Block Type" });
    }
};

// Delete Block Type
const deleteBlockType = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.blockType.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Block Type deleted successfully" });
    } catch (error) {
        console.error("Failed to delete Block Type:", error);
        res.status(500).json({ error: "Failed to delete Block Type" });
    }
};

module.exports = {
    createBlockType,
    getAllBlockTypes,
    updateBlockType,
    deleteBlockType,
};
