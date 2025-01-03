const prisma = require("../../../database/prismaClient");

// Get All Employment Types
const getAllEmploymentTypes = async (req, res) => {
    try {
        const employmentTypes = await prisma.employmentType.findMany();
        res.json(employmentTypes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch employment types" });
    }
};

// Add Employment Type
const addEmploymentType = async (req, res) => {
    const { type, description } = req.body;
    try {
        const newEmploymentType = await prisma.employmentType.create({
            data: { type, description },
        });
        res.json(newEmploymentType);
    } catch (error) {
        res.status(500).json({ error: "Failed to add employment type" });
    }
};

// Update Employment Type
const updateEmploymentType = async (req, res) => {
    const { id } = req.params;
    const { type, description } = req.body;
    try {
        const updatedEmploymentType = await prisma.employmentType.update({
            where: { id: Number(id) },
            data: { type, description },
        });
        res.json(updatedEmploymentType);
    } catch (error) {
        res.status(500).json({ error: "Failed to update employment type" });
    }
};

// Remove Employment Type
const removeEmploymentType = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.employmentType.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Employment type removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove employment type" });
    }
};

module.exports = {
    getAllEmploymentTypes,
    addEmploymentType,
    updateEmploymentType,
    removeEmploymentType,
};