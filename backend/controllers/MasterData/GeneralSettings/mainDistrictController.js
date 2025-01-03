const prisma = require("../../../database/prismaClient");

// Get All Main Districts
const getAllMainDistricts = async (req, res) => {
    try {
        const mainDistricts = await prisma.mainDistrict.findMany({
            include: { emirates: true },
        });
        res.json(mainDistricts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch main districts" });
    }
};

// Add Main District
const addMainDistrict = async (req, res) => {
    const { emiratesId, name } = req.body;
    try {
        const newMainDistrict = await prisma.mainDistrict.create({
            data: { emiratesId, name },
        });
        res.json(newMainDistrict);
    } catch (error) {
        res.status(500).json({ error: "Failed to add main district" });
    }
};

// Update Main District
const updateMainDistrict = async (req, res) => {
    const { id } = req.params;
    const { emiratesId, name } = req.body;
    try {
        const updatedMainDistrict = await prisma.mainDistrict.update({
            where: { id: Number(id) },
            data: { emiratesId, name },
        });
        res.json(updatedMainDistrict);
    } catch (error) {
        res.status(500).json({ error: "Failed to update main district" });
    }
};

// Remove Main District
const removeMainDistrict = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.mainDistrict.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Main district removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove main district" });
    }
};

module.exports = {
    getAllMainDistricts,
    addMainDistrict,
    updateMainDistrict,
    removeMainDistrict,
};