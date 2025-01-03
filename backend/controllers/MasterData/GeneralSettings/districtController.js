const prisma = require("../../../database/prismaClient");

// Get All Districts
const getAllDistricts = async (req, res) => {
    try {
        const districts = await prisma.district.findMany({
            include: { mainDistrict: { include: { emirates: true } } },
        });
        res.json(districts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch districts" });
    }
};

// Add District
const addDistrict = async (req, res) => {
    const { mainDistrictId, name } = req.body;
    try {
        const newDistrict = await prisma.district.create({
            data: { mainDistrictId, name },
        });
        res.json(newDistrict);
    } catch (error) {
        res.status(500).json({ error: "Failed to add district" });
    }
};

// Update District
const updateDistrict = async (req, res) => {
    const { id } = req.params;
    const { mainDistrictId, name } = req.body;
    try {
        const updatedDistrict = await prisma.district.update({
            where: { id: Number(id) },
            data: { mainDistrictId, name },
        });
        res.json(updatedDistrict);
    } catch (error) {
        res.status(500).json({ error: "Failed to update district" });
    }
};

// Remove District
const removeDistrict = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.district.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "District removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove district" });
    }
};

module.exports = {
    getAllDistricts,
    addDistrict,
    updateDistrict,
    removeDistrict,
};