const prisma = require("../../../database/prismaClient");

// Search Countries by Name or Code
const searchCountry = async (req, res) => {
    const { countryName, countryCode } = req.query;
    const filters = {};

    try {
        if (countryName) {
            filters.countryName = {
                contains: countryName,
            };
        }

        if (countryCode) {
            filters.countryCode = {
                startsWith: countryCode,
            };
        }

        const countries = await prisma.country.findMany({
            where: filters,
            orderBy: { countryName: "asc" },
            include: { languages: { include: { language: true } } },
        });

        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
};

// Add New Country with Languages
const addCountry = async (req, res) => {
    const { countryName, countryCode, isoCode, languages } = req.body;

    if (!countryName || !countryCode || !isoCode) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newCountry = await prisma.country.create({
            data: {
                countryName,
                countryCode,
                isoCode,
                languages: languages
                    ? {
                        create: languages.map((langId) => ({
                            language: { connect: { id: langId } },
                        })),
                    }
                    : undefined,
            },
        });
        res.status(201).json(newCountry);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Failed to add country" });
    }
};

// Get All Countries
const getAllCountries = async (req, res) => {
    try {
        const countries = await prisma.country.findMany({
            orderBy: { countryName: "asc" },
            include: { languages: { include: { language: true } } },
        });
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve countries" });
    }
};

// Update Country
const updateCountry = async (req, res) => {
    const { id } = req.params;
    const { countryName, countryCode, isoCode, languages } = req.body;

    try {
        const updatedCountry = await prisma.country.update({
            where: { id: Number(id) },
            data: {
                countryName,
                countryCode,
                isoCode,
                // Only update languages if provided
                ...(languages && {
                    languages: {
                        deleteMany: {},
                        create: languages.map((langId) => ({
                            language: { connect: { id: langId } },
                        })),
                    },
                }),
            },
        });
        res.json(updatedCountry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update country" });
    }
};

// Delete Country
const deleteCountry = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.country.delete({ where: { id: Number(id) } });
        res.json({ message: "Country deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete country" });
    }
};

module.exports = {
    addCountry,
    searchCountry,
    getAllCountries,
    updateCountry,
    deleteCountry,
};