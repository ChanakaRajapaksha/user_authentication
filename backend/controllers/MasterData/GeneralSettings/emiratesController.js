const prisma = require("../../../database/prismaClient");

// Get All Emirates
const getAllEmirates = async (req, res) => {
    try {
        const emirates = await prisma.emirates.findMany();
        res.json(emirates);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch emirates" });
    }
};

// Add Emirates
const addEmirates = async (req, res) => {
    const { name } = req.body;
    try {
        const newEmirate = await prisma.emirates.create({
            data: { name },
        });
        res.json(newEmirate);
    } catch (error) {
        res.status(500).json({ error: "Failed to add emirate" });
    }
};

// Update Emirates
const updateEmirates = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedEmirate = await prisma.emirates.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.json(updatedEmirate);
    } catch (error) {
        res.status(500).json({ error: "Failed to update emirate" });
    }
};

// Remove Emirates
const removeEmirates = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.emirates.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Emirate removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove emirate" });
    }
};

module.exports = {
    getAllEmirates,
    addEmirates,
    updateEmirates,
    removeEmirates,
};