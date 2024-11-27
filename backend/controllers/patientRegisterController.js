const prisma = require('../database/prismaClient');
const logger = require('../logger');

// Handle new patient registration
const handleNewPatient = async (req, res) => {
    const {
        fullName,
        dateOfBirth,
        gender,
        nationality = null,
        email,
        maritalStatus = null,
        visaType = null,
        nationalId,
        otherIdType = null,
        otherIdValue = null,
        contactNumberMobile,
        contactNumberWork = null,
    } = req.body;

    // Validate required fields
    if (
        !fullName ||
        !dateOfBirth ||
        !gender ||
        !email ||
        !nationalId ||
        !contactNumberMobile
    ) {
        return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    try {
        // Check for duplicate email or national ID in the database
        const duplicateEmail = await prisma.patient.findUnique({
            where: { email },
        });

        const duplicateNationalId = await prisma.patient.findUnique({
            where: { nationalId },
        });

        if (duplicateEmail) {
            return res.status(409).json({ message: 'Email already exists.' }); // Conflict
        }

        if (duplicateNationalId) {
            return res.status(409).json({ message: 'National ID already exists.' }); // Conflict
        }

        // Calculate age from date of birth
        const currentDate = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = currentDate.getFullYear() - birthDate.getFullYear() -
            (currentDate.getMonth() < birthDate.getMonth() ||
                (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) ? 1 : 0);

        const normalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

        // Create the new patient record
        const newPatient = await prisma.patient.create({
            data: {
                fullName,
                dateOfBirth: birthDate,
                age,
                gender: normalizedGender,
                nationality,
                email,
                maritalStatus,
                visaType,
                nationalId,
                otherIdType,
                otherIdValue,
                contactNumberMobile,
                contactNumberWork,
            },
        });

        logger.info(`Patient registered: ${email}`); // Log additional details
        res.status(201).json({ success: `New patient ${newPatient.fullName} created!` });
    } catch (err) {
        console.error(err);
        logger.error(`Error during patient registration: ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

module.exports = { handleNewPatient };
