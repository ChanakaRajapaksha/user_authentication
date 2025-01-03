const prisma = require("../../../database/prismaClient");

// Add New Resource Type
const addResourceType = async (req, res) => {
    const { type, name, description } = req.body;

    if (!type || !name) {
        return res
            .status(400)
            .json({ error: "Resource type and name are required" });
    }

    try {
        const newResourceType = await prisma.resourceType.create({
            data: {
                type,
                name,
                description,
            },
        });
        res.status(201).json(newResourceType);
    } catch (error) {
        res.status(500).json({ error: "Failed to add resource type" });
    }
};

// Update Resource Type
const updateResourceType = async (req, res) => {
    const { id } = req.params;
    const { type, name, description } = req.body;

    try {
        const updatedResourceType = await prisma.resourceType.update({
            where: { id: Number(id) },
            data: { type, name, description },
        });
        res.json(updatedResourceType);
    } catch (error) {
        res.status(500).json({ error: "Failed to update resource type" });
    }
};

// Delete Resource Type
const deleteResourceType = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.resourceType.delete({ where: { id: Number(id) } });
        res.json({ message: "Resource type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete resource type" });
    }
};

// Get All Resource Types
const getAllResourceTypes = async (req, res) => {
    try {
        const resourceTypes = await prisma.resourceType.findMany({
            orderBy: { name: "asc" },
        });
        res.json(resourceTypes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch resource types" });
    }
};

module.exports = {
    addResourceType,
    updateResourceType,
    deleteResourceType,
    getAllResourceTypes,
};