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

module.exports = {
    createBlockType,
};
