const prisma = require("../../../database/prismaClient");

// Get all OverBookings
const getAllOverBookings = async (req, res) => {
    const { specialty, doctorId } = req.query;

    try {
        const filter = {};

        if (specialty) {
            filter.specialty = specialty;
        }
        if (doctorId) {
            filter.doctorId = parseInt(doctorId);
        }

        const overBookings = await prisma.overBooking.findMany({
            where: filter,
            include: {
                doctor: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(overBookings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch over bookings" });
    }
};

// Add OverBooking
const addOverBooking = async (req, res) => {
    const {
        doctorId,
        specialty,
        overBookingAvailable,
        slotOverBookingCount,
        dayOverBookingCount,
    } = req.body;

    try {
        // Check if doctor exists
        const doctor = await prisma.doctor.findUnique({
            where: {
                id: parseInt(doctorId),
            },
        });

        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        // If overBooking is not available, slot and day counts should be set to 0
        const newOverBooking = await prisma.overBooking.create({
            data: {
                doctorId: parseInt(doctorId),
                specialty,
                overBookingAvailable: overBookingAvailable === "Yes",
                slotOverBookingCount: overBookingAvailable === "Yes" ? slotOverBookingCount : 0,
                dayOverBookingCount: overBookingAvailable === "Yes" ? dayOverBookingCount : 0,
            },
        });

        res.status(201).json(newOverBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add over booking" });
    }
};

// Update OverBooking
const updateOverBooking = async (req, res) => {
    const { id } = req.params;
    const {
        overBookingAvailable,
        slotOverBookingCount,
        dayOverBookingCount,
    } = req.body;

    try {
        const updatedOverBooking = await prisma.overBooking.update({
            where: { id: parseInt(id) },
            data: {
                overBookingAvailable: overBookingAvailable === "Yes",
                slotOverBookingCount: overBookingAvailable === "Yes" ? slotOverBookingCount : 0,
                dayOverBookingCount: overBookingAvailable === "Yes" ? dayOverBookingCount : 0,
            },
        });
        res.json(updatedOverBooking);
    } catch (error) {
        res.status(500).json({ error: "Failed to update over booking" });
    }
};

// Delete OverBooking
const deleteOverBooking = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.overBooking.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Over booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete over booking" });
    }
};

// Get OverBooking by Doctor ID
const getOverBookingByDoctor = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const overBooking = await prisma.overBooking.findMany({
            where: { doctorId: parseInt(doctorId) },
            include: {
                doctor: true,
            },
        });

        res.json(overBooking);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch over booking" });
    }
};
module.exports = { getAllOverBookings, addOverBooking, updateOverBooking, deleteOverBooking, getOverBookingByDoctor };