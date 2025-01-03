const prisma = require("../../../database/prismaClient");

// Add New Language
const addLanguage = async (req, res) => {
    const { language } = req.body;

    if (!language) {
        return res.status(400).json({ error: "Language is required" });
    }

    try {
        const newLanguage = await prisma.language.create({
            data: { language },
        });
        res.status(201).json(newLanguage);
    } catch (error) {
        res.status(500).json({ error: "Failed to add language" });
    }
};

// Update Language
const updateLanguage = async (req, res) => {
    const { id } = req.params;
    const { language } = req.body;

    try {
        const updatedLanguage = await prisma.language.update({
            where: { id: Number(id) },
            data: { language },
        });
        res.json(updatedLanguage);
    } catch (error) {
        res.status(500).json({ error: "Failed to update language" });
    }
};

// Delete Language
const deleteLanguage = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.language.delete({ where: { id: Number(id) } });
        res.json({ message: "Language deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete language" });
    }
};

// Enable/Disable Language
const toggleLanguageStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const language = await prisma.language.findUnique({
            where: { id: Number(id) },
        });

        if (!language) {
            return res.status(404).json({ error: "Language not found" });
        }

        const updatedLanguage = await prisma.language.update({
            where: { id: Number(id) },
            data: { enabled: !language.enabled },
        });

        res.json({
            message: `Language ${updatedLanguage.enabled ? "enabled" : "disabled"
                } successfully`,
            data: updatedLanguage,
        });
    } catch (error) {
        console.error("Error toggling language status:", error);
        res.status(500).json({ error: "Failed to toggle language status" });
    }
};

// Get All Enabled Languages
const getEnabledLanguages = async (req, res) => {
    try {
        const languages = await prisma.language.findMany({
            where: { enabled: true },
            orderBy: { language: "asc" },
        });
        res.json(languages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch languages" });
    }
};

// Get All Languages (for admin to view all)
const getAllLanguages = async (req, res) => {
    try {
        const languages = await prisma.language.findMany({
            orderBy: { language: "asc" },
        });
        res.json(languages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch all languages" });
    }
};

module.exports = {
    addLanguage,
    updateLanguage,
    deleteLanguage,
    toggleLanguageStatus,
    getEnabledLanguages,
    getAllLanguages,
};