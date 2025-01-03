const prisma = require("../database/prismaClient");

const sendSMS = require("../utils/smsService");

// Save Patient Pre Registration
const savePatientPreRegistration = async (req, res) => {
    try {
        const {
            scheduleType,
            scheduleDate,
            branch,
            specialty,
            doctorName,
            scheduleTime,
            slot,
            patientFullName,
            dob,
            gender,
            mobile,
            email,
            nationalId,
            whatsappMobile,
            remark,
            isVIP,
            scheduledBy,
            confirmViaSms,
            confirmViaEmail,
            remindViaSms,
            remindViaEmail,
        } = req.body;

        // Backend Validations
        if (
            !scheduleType ||
            !scheduleDate ||
            !branch ||
            !specialty ||
            !doctorName ||
            !scheduleTime ||
            !patientFullName ||
            !dob ||
            !gender ||
            !mobile
        ) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const age = calculateAge(new Date(dob));

        // Ensure schedule date is present or future
        if (new Date(scheduleDate) < new Date()) {
            return res
                .status(400)
                .json({ message: "Schedule date must be in the present or future" });
        }

        // Check if the doctor already has 3 bookings for the selected date and branch
        const bookingCount = await prisma.patientPreRegistration.count({
            where: {
                doctorName,
                branch,
                scheduleDate: new Date(scheduleDate),
            },
        });

        if (bookingCount >= 3) {
            return res.status(400).json({
                message: "Booking limit reached for the selected doctor on this date",
            });
        }

        // Generate a unique temporary ID
        const temporaryId = generateTemporaryId(branch);

        // Save the patient pre-registration data
        const preRegistration = await prisma.patientPreRegistration.create({
            data: {
                temporaryId,
                scheduleType,
                scheduleDate: new Date(scheduleDate),
                branch,
                specialty,
                doctorName,
                scheduleTime,
                slot,
                patientFullName,
                dob: new Date(dob),
                age,
                gender,
                mobile,
                email,
                nationalId,
                whatsappMobile,
                remark,
                isVIP: isVIP || false,
                scheduledBy: scheduledBy || "Hospital Staff",
                confirmViaSms: confirmViaSms || false,
                confirmViaEmail: confirmViaEmail || false,
                remindViaSms: remindViaSms || false,
                remindViaEmail: remindViaEmail || false,
            },
        });

        // Send SMS with temporary ID
        await sendTemporaryIdSms(mobile, preRegistration);

        res.status(201).json({
            message: "Pre-registration saved successfully",
            data: preRegistration,
        });
    } catch (error) {
        console.error("Error saving pre-registration:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Utility: Calculate Age
const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    return `${age} years`;
};

// Utility: Generate Temporary ID
const generateTemporaryId = (branch) => {
    // Extract meaningful initials for the branch code
    const branchWords = branch.split(" ");
    const branchCode = branchWords
        .filter((word) => word.length > 2)
        .map((word) => word[0].toUpperCase())
        .join("")
        .substring(0, 4); // Limit to 4 characters

    const suffix = "TI"; // Static suffix for temporary IDs
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000); // 8 random digits

    return `${branchCode}${suffix}${randomDigits}`;
};

// Utility: Send SMS
const sendTemporaryIdSms = async (mobile, preRegistration) => {
    const { temporaryId, doctorName, scheduleDate, scheduleTime, branch } =
        preRegistration;

    const message = `Dear Patient,
Pre-registration was completed successfully with the doctor ${doctorName} on the date ${scheduleDate.toISOString().split("T")[0]
        } at time ${scheduleTime}.
Please show your temporary identification number at the reception desk when you arrive at the hospital (${branch}) to confirm your appointment arrival.

Temporary ID: ${temporaryId}`;

    const result = await sendSMS(mobile, message);

    if (result.success) {
        console.log("Notification sent to the patient successfully.");
    } else {
        console.error("Failed to send SMS notification:", result.error);
    }
};

// Get All Patient Pre Registration Details
const getAllPatientPreDetails = async (req, res) => {
    try {
        // Fetch all patient pre-registrations
        const patientDetails = await prisma.patientPreRegistration.findMany();
        res.status(200).json({
            message: "Patient details retrieved successfully",
            data: patientDetails,
        });
    } catch (error) {
        console.error("Error retrieving patient details:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

//Get Selected Patient Details
const getPatientPreDetails = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Patient ID is required" });
        }

        const patientDetails = await prisma.patientPreRegistration.findUnique({
            where: {
                temporaryId: id,
            },
        });

        if (!patientDetails) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({
            message: "Patient details retrieved successfully",
            data: patientDetails,
        });
    } catch (error) {
        console.error("Error retrieving patient details:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

//Get Pre-Registration List with Smart Search
const getPreRegistrations = async (req, res) => {
    try {
        const {
            scheduledDate,
            branch,
            temporaryId,
            patientName,
            nationalId,
            mobile,
            specialty,
            doctorName,
        } = req.query;

        const filters = {};

        if (scheduledDate) {
            const startOfDay = new Date(scheduledDate);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(scheduledDate);
            endOfDay.setHours(23, 59, 59, 999);

            filters.scheduleDate = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }

        if (branch) {
            filters.branch = {
                contains: branch,
            };
        }

        if (temporaryId) {
            filters.temporaryId = temporaryId;
        }

        if (patientName) {
            filters.patientFullName = {
                contains: patientName,
            };
        }

        if (nationalId) {
            filters.nationalId = nationalId;
        }

        if (mobile) {
            filters.mobile = mobile;
        }

        if (specialty) {
            filters.specialty = specialty;
        }

        if (doctorName) {
            filters.doctorName = doctorName;
        }

        console.log("Filters being applied:", filters);

        const preRegistrations = await prisma.patientPreRegistration.findMany({
            where: filters,
            orderBy: {
                scheduleDate: "asc",
            },
        });

        console.log("Query Results:", preRegistrations);

        const formattedData = preRegistrations.map((pr) => ({
            scheduleType: pr.scheduleType,
            scheduledDate: pr.scheduleDate.toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
            }),
            scheduleTime: pr.scheduleTime,
            branch: pr.branch,
            temporaryId: pr.temporaryId,
            patientName: `${pr.patientFullName}${pr.isVIP ? " *VIP*" : ""}`,
            nationalId: pr.nationalId || "N/A",
            mobile: pr.mobile,
            specialty: pr.specialty,
            doctorName: pr.doctorName,
            remarks: pr.remark || "No remarks",
            scheduledBy: pr.scheduledBy,
            appointmentStatus: pr.appointmentStatus || "Scheduled",
        }));

        res.status(200).json({
            message: "Pre-registration list retrieved successfully",
            data: formattedData,
        });
    } catch (error) {
        console.error("Error retrieving pre-registrations:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Edit Pre Registration Details
const editPreRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            patientName,
            mobile,
            email,
            infoSource,
            defaultDisplay,
            remark,
            callStatus,
            notifyPatient,
            rescheduleDate,
            rescheduleTime,
        } = req.body;

        const preRegistration = await prisma.patientPreRegistration.findUnique({
            where: { id: Number(id) },
        });

        if (!preRegistration) {
            return res.status(404).json({ message: "Pre-registration not found" });
        }

        // Update details
        const updatedData = {
            patientFullName: patientName || preRegistration.patientFullName,
            mobile: mobile || preRegistration.mobile,
            email: email || preRegistration.email,
            remark: remark || preRegistration.remark,
            infoSource: infoSource || preRegistration.infoSource,
            defaultDisplay:
                defaultDisplay === undefined
                    ? preRegistration.defaultDisplay
                    : defaultDisplay,
            callStatus: callStatus || preRegistration.callStatus,
        };

        if (rescheduleDate && rescheduleTime) {
            updatedData.scheduleDate = new Date(rescheduleDate);
            updatedData.scheduleTime = rescheduleTime;
        }

        const updatedPreRegistration = await prisma.patientPreRegistration.update({
            where: { id: Number(id) },
            data: updatedData,
        });

        // Notify patient if checkbox is selected
        if (notifyPatient) {
            const message = `Dear ${updatedPreRegistration.patientFullName
                },\n\nYour appointment has been updated.\n\nDate: ${rescheduleDate || preRegistration.scheduleDate
                }\nTime: ${rescheduleTime || preRegistration.scheduleTime}\nBranch: ${preRegistration.branch
                }\nDoctor: ${preRegistration.doctorName}\n\nThank you.`;
            await sendSMS(updatedPreRegistration.mobile, message);
        }

        res.status(200).json({
            message: "Pre-registration updated successfully",
            data: updatedPreRegistration,
        });
    } catch (error) {
        console.error("Error updating pre-registration:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const confirmArrival = async (req, res) => {
    try {
        const { id } = req.params;

        // Update appointment status to "Arrived"
        const updatedPreRegistration = await prisma.patientPreRegistration.update({
            where: { id: Number(id) },
            data: { appointmentStatus: "Arrived" },
        });

        res.status(200).json({
            message: "Patient arrival confirmed successfully",
            data: updatedPreRegistration,
        });
    } catch (error) {
        console.error("Error confirming patient arrival:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const addPatientNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { patientNote } = req.body;

        if (!patientNote || patientNote.length < 100 || patientNote.length > 500) {
            return res.status(400).json({
                message: "Patient note must be between 100 and 500 characters.",
            });
        }

        // Update remark with appended notes
        const updatedPreRegistration = await prisma.patientPreRegistration.update({
            where: { id: Number(id) },
            data: {
                remark: `${req.body.previousRemarks || ""
                    }\n\nPatient Note: ${patientNote}`,
            },
        });

        res.status(200).json({
            message: "Patient note added successfully",
            data: updatedPreRegistration,
        });
    } catch (error) {
        console.error("Error adding patient note:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    savePatientPreRegistration,
    getAllPatientPreDetails,
    getPatientPreDetails,
    getPreRegistrations,
    editPreRegistration,
    confirmArrival,
    addPatientNote,
};