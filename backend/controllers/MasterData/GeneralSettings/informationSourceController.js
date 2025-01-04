const prisma = require("../../../database/prismaClient");

// Add New Information Source
const addInformationSource = async (req, res) => {
    const { sourceName, description } = req.body;

    if (!sourceName) {
        return res.status(400).json({ error: "Information source name is required" });
    }

    try {
        const newSource = await prisma.informationSource.create({
            data: {
                sourceName,
                description,
            },
        });
        res.status(201).json(newSource);
    } catch (error) {
        res.status(500).json({ error: "Failed to add information source" });
    }
};

// Update Information Source
const updateInformationSource = async (req, res) => {
    const { id } = req.params;
    const { sourceName, description } = req.body;

    try {
        const updatedSource = await prisma.informationSource.update({
            where: { id: Number(id) },
            data: { sourceName, description },
        });
        res.json(updatedSource);
    } catch (error) {
        res.status(500).json({ error: "Failed to update information source" });
    }
};

// Delete Information Source
const deleteInformationSource = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.informationSource.delete({ where: { id: Number(id) } });
        res.json({ message: "Information source deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete information source" });
    }
};

// Get All Information Sources (Sorted by Name)
const getAllInformationSources = async (req, res) => {
    try {
        const sources = await prisma.informationSource.findMany({
            orderBy: { sourceName: "asc" },
        });
        res.json(sources);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch information sources" });
    }
};

module.exports = {
    addInformationSource,
    updateInformationSource,
    deleteInformationSource,
    getAllInformationSources,
};
