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
        ...dynamicFields
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
                customFields: dynamicFields,
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

// Get All Patient Details
const getAllPatients = async (req, res) => {
    try {
        const patients = await prisma.patient.findMany({
            select: {
                patientId: true,
                fullName: true,
                dateOfBirth: true,
                age: true,
                gender: true,
                nationality: true,
                email: true,
                maritalStatus: true,
                visaType: true,
                nationalId: true,
                otherIdType: true,
                otherIdValue: true,
                contactNumberMobile: true,
                contactNumberWork: true,
                customFields: true,
            },
        });

        // Log the action
        logger.info(`Fetched ${patients.length} patients from the database.`);

        res.status(200).json(patients);
    } catch (err) {
        console.error(err);
        logger.error(`Error retrieving patients: ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

// Get Selected Patient Details
const getPatientDetails = async (req, res) => {
    const { patientId } = req.params;

    if (!patientId) {
        return res.status(400).json({ message: 'Patient ID is required.' });
    }

    try {
        const patient = await prisma.patient.findUnique({
            where: { patientId },
            select: {
                patientId: true,
                fullName: true,
                dateOfBirth: true,
                age: true,
                gender: true,
                nationality: true,
                email: true,
                maritalStatus: true,
                visaType: true,
                nationalId: true,
                otherIdType: true,
                otherIdValue: true,
                contactNumberMobile: true,
                contactNumberWork: true,
                customFields: true,
            },
        });

        if (!patient) {
            logger.warn(`Patient with ID ${patientId} not found.`);
            return res.status(404).json({ message: 'Patient not found.' });
        }

        const formattedCustomFields = [];
        if (patient.customFields) {
            for (const [key, value] of Object.entries(patient.customFields)) {
                const cleanedKey = key.replace(/_\d+$/, ''); // Remove trailing numerals
                formattedCustomFields.push({ key: cleanedKey, value });
            }
        }

        const response = {
            patientId: patient.patientId,
            fullName: patient.fullName,
            dateOfBirth: patient.dateOfBirth,
            age: patient.age,
            gender: patient.gender,
            nationality: patient.nationality,
            email: patient.email,
            maritalStatus: patient.maritalStatus,
            visaType: patient.visaType,
            nationalId: patient.nationalId,
            otherIdType: patient.otherIdType,
            otherIdValue: patient.otherIdValue,
            contactNumberMobile: patient.contactNumberMobile,
            contactNumberWork: patient.contactNumberWork,
            customFields: formattedCustomFields, 
        };

        logger.info(`Fetched details for patient ID: ${patientId}`);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        logger.error(`Error retrieving patient details: ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

module.exports = { handleNewPatient, getAllPatients, getPatientDetails };
