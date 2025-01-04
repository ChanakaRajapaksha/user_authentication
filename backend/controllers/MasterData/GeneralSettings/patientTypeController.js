const prisma = require("../../../database/prismaClient");

// Add New Patient Type
const addPatientType = async (req, res) => {
    const { typeName, description } = req.body;

    if (!typeName || typeName.length > 50) {
        return res.status(400).json({ error: "Patient type is required" });
    }

    try {
        const newPatientType = await prisma.patientType.create({
            data: {
                typeName,
                description,
            },
        });
        res.status(201).json(newPatientType);
    } catch (error) {
        res.status(500).json({ error: "Failed to add patient type" });
    }
};

// Update Patient Type
const updatePatientType = async (req, res) => {
    const { id } = req.params;
    const { typeName, description } = req.body;

    try {
        const updatedPatientType = await prisma.patientType.update({
            where: { id: Number(id) },
            data: {
                typeName,
                description,
            },
        });
        res.json(updatedPatientType);
    } catch (error) {
        res.status(500).json({ error: "Failed to update patient type" });
    }
};

// Delete Patient Type
const deletePatientType = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.patientType.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Patient type deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete patient type" });
    }
};

// Get All Patient Types (Sorted by Name)
const getAllPatientTypes = async (req, res) => {
    try {
        const patientTypes = await prisma.patientType.findMany({
            orderBy: { typeName: "asc" },
        });
        res.json(patientTypes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch patient types" });
    }
};

module.exports = { addPatientType, updatePatientType, deletePatientType, getAllPatientTypes };
