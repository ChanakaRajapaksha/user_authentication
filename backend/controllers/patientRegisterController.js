const prisma = require('../database/prismaClient');
const logger = require('../logger');


const handleNewPatient = async (req, res) => {
    console.log(req.body);

    const {
        fullName = null,
        dateOfBirth = null,
        gender = null,
        nationality = null,
        email = null,
        maritalStatus = null,
        visaType = null,
        nationalId = null,
        otherIdType = null,
        otherIdValue = null,
        contactNumberMobile = null,
        contactNumberWork = null,
        consultationType = null,
        doctorName = null,
        appointmentDate = null,
        speciality = null,
        consultationReason = null,
        paymentType = null,
        insurancePlan = null,
        policyNumber = null,
        policyExpiryDate = null,
        insuranceCardNumber = null,
        insuranceProvider = null,
        insuranceSubProvider = null,
        ...dynamicFields 
    } = req.body;
    
    // Validate required fields
    // if (
    //     !fullName ||
    //     !dateOfBirth ||
    //     !gender ||
    //     !email ||
    //     !nationalId 
    // ) {
    //     return res.status(400).json({ message: 'All required fields must be filled.' });
    // }

    // Conditional validation for Insurance payment type
    if (paymentType === "Insurance" && (!insuranceCardNumber || !insuranceProvider || !insuranceSubProvider)) {
        return res.status(400).json({
            message: 'Insurance card number, provider, and sub-provider are required for Insurance payment type.',
        });
    }

    try {
        const duplicateEmail = await prisma.patient.findUnique({
            where: { email },
        });

        const duplicateNationalId = await prisma.patient.findUnique({
            where: { nationalId },
        });

        if (duplicateEmail) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        if (duplicateNationalId) {
            return res.status(409).json({ message: 'National ID already exists.' });
        }

        const currentDate = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = currentDate.getFullYear() - birthDate.getFullYear() -
            (currentDate.getMonth() < birthDate.getMonth() ||
                (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) ? 1 : 0);

        const normalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

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
                consultationType,
                doctorName,
                appointmentDate: new Date(appointmentDate),
                speciality,
                consultationReason,
                paymentType,
                insurancePlan,
                insuranceCardNumber: paymentType === "Insurance" ? insuranceCardNumber : null,
                insuranceProvider: paymentType === "Insurance" ? insuranceProvider : null,
                insuranceSubProvider: paymentType === "Insurance" ? insuranceSubProvider : null,
                policyNumber,
                policyExpiryDate: policyExpiryDate ? new Date(policyExpiryDate) : null,
                customFields: dynamicFields, 
            },
        });

        logger.info(`Patient registered: ${email}`);
        res.status(201).json({ success: `New patient ${newPatient.fullName} created!` });
    } catch (err) {
        console.error(err);
        logger.error(`Error during patient registration: ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

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
                consultationType: true,
                doctorName: true,
                appointmentDate: true,
                speciality: true,
                consultationReason: true,
                paymentType: true,
                insurancePlan: true,
                policyNumber: true,
                policyExpiryDate: true,
                insuranceCardNumber: true,
                insuranceProvider: true,
                insuranceSubProvider: true,
                customFields: true,
            },
        });

        logger.info(`Fetched ${patients.length} patients from the database.`);
        res.status(200).json(patients);
    } catch (err) {
        console.error(err);
        logger.error(`Error retrieving patients: ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

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
                consultationType: true,
                doctorName: true,
                appointmentDate: true,
                speciality: true,
                consultationReason: true,
                paymentType: true,
                insurancePlan: true,
                policyNumber: true,
                policyExpiryDate: true,
                insuranceCardNumber: true,
                insuranceProvider: true,
                insuranceSubProvider: true,
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
                const cleanedKey = key.replace(/_\d+$/, '');
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
            consultationType: patient.consultationType,
            doctorName: patient.doctorName,
            appointmentDate: patient.appointmentDate,
            speciality: patient.speciality,
            consultationReason: patient.consultationReason,
            paymentType: patient.paymentType,
            insurancePlan: patient.insurancePlan,
            policyNumber: patient.policyNumber,
            policyExpiryDate: patient.policyExpiryDate,
            insuranceCardNumber: patient.insuranceCardNumber,
            insuranceProvider: patient.insuranceProvider,
            insuranceSubProvider: patient.insuranceSubProvider,
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
