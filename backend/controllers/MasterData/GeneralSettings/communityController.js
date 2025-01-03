const prisma = require("../../../database/prismaClient");

const getAllCommunities = async (req, res) => {
    try {
        const communities = await prisma.community.findMany({
            include: {
                district: {
                    include: { mainDistrict: { include: { emirates: true } } },
                },
            },
        });
        res.json(communities);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch communities" });
    }
};

const addCommunity = async (req, res) => {
    const { districtId, name } = req.body;
    try {
        const newCommunity = await prisma.community.create({
            data: { districtId, name },
        });
        res.json(newCommunity);
    } catch (error) {
        res.status(500).json({ error: "Failed to add community" });
    }
};

const updateCommunity = async (req, res) => {
    const { id } = req.params;
    const { districtId, name } = req.body;
    try {
        const updatedCommunity = await prisma.community.update({
            where: { id: Number(id) },
            data: { districtId, name },
        });
        res.json(updatedCommunity);
    } catch (error) {
        res.status(500).json({ error: "Failed to update community" });
    }
};

const removeCommunity = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.community.delete({
            where: { id: Number(id) },
        });
        res.json({ message: "Community removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove community" });
    }
};

module.exports = {
    getAllCommunities,
    addCommunity,
    updateCommunity,
    removeCommunity,
};