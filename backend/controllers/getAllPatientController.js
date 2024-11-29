const prisma = require('../database/prismaClient');
const logger = require('../logger');

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

module.exports = { getAllPatients };