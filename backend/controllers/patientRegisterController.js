const prisma = require("../database/prismaClient");

const addDynamicFields = async (req, res) => {
    try {
        const fields = req.body;

        if (!Array.isArray(fields) || fields.length === 0) {
            return res.status(400).json({
                error: "Input should be a non-empty array of fields",
            });
        }

        const addedFields = [];
        for (const field of fields) {
            const {
                field_name,
                field_type,
                dropdown_options,
                radio_buttons,
                is_required,
                category,
            } = field;

            if (!field_name || !field_type || !category) {
                return res.status(400).json({
                    error: "All fields are required: field_name, field_type, category",
                });
            }

            const existingDynamicField = await prisma.dynamicField.findUnique({
                where: { field_name },
            });

            let newDynamicField;
            if (!existingDynamicField) {
                newDynamicField = await prisma.dynamicField.create({
                    data: {
                        field_name,
                        field_type,
                        dropdown_options: Array.isArray(dropdown_options)
                            ? dropdown_options.join(", ")
                            : dropdown_options || null,
                        radio_buttons: Array.isArray(radio_buttons)
                            ? radio_buttons.join(", ")
                            : radio_buttons || null,
                        is_required,
                        category,
                    },
                });
                addedFields.push(newDynamicField);
            } else {
                addedFields.push(existingDynamicField);
            }
        }

        return res.status(201).json({
            message: "Dynamic fields added successfully",
            data: addedFields.map((field) => ({
                ...field,
                dropdown_options: field.dropdown_options
                    ? field.dropdown_options.split(", ")
                    : null,
                radio_buttons: field.radio_buttons
                    ? field.radio_buttons.split(", ")
                    : null,
            })),
        });
    } catch (error) {
        console.error("Error adding dynamic fields:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const getDynamicFields = async (req, res) => {
    try {
        const fields = await prisma.dynamicField.findMany({
            select: { field_name: true, field_type: true },
        });
        return res.status(200).json(fields);
    } catch (error) {
        console.error("Error fetching dynamic fields:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// Create Insurance Data
const addInsurance = async (req, res) => {
    try {
        const {
            insuranceProvider,
            subInsurance,
            networkType,
            insuranceCardNumber,
            extraCardNumber,
            insuranceEffectiveDate,
            insuranceExpiryDate,
            certificateNo,
            dependentsNo = 0,
            insuranceClaimNo,
            maxInsuranceLiability,
            insuranceApprovalLimit,
            maxInsuranceCoPay,
            coPayPatient,
            patientId,
        } = req.body;

        // Validate mandatory fields
        if (!insuranceCardNumber || !insuranceExpiryDate) {
            return res.status(400).json({
                message: "Required fields are missing",
                missingFields: [
                    !insuranceCardNumber && "insuranceCardNumber",
                    !insuranceExpiryDate && "insuranceExpiryDate",
                ].filter(Boolean),
            });
        }

        const result = await prisma.insurance.create({
            data: {
                insuranceProvider,
                subInsurance,
                networkType,
                insuranceCardNumber,
                extraCardNumber,
                insuranceEffectiveDate: new Date(insuranceEffectiveDate),
                insuranceExpiryDate: new Date(insuranceExpiryDate),
                certificateNo,
                dependentsNo,
                insuranceClaimNo,
                maxInsuranceLiability: parseFloat(maxInsuranceLiability),
                insuranceApprovalLimit: parseFloat(insuranceApprovalLimit),
                maxInsuranceCoPay: parseFloat(maxInsuranceCoPay),
                coPayPatient: parseFloat(coPayPatient),
                patientId,
            },
        });

        res.status(201).json({
            message: "Insurance added successfully!",
            insurance: result,
        });
    } catch (error) {
        console.error("Error adding insurance:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Add deductible data
const addDeductible = async (req, res) => {
    try {
        const {
            deductibleType,
            amount,
            deductibleDate,
            insuranceId,
        } = req.body;

        // Validate mandatory fields
        if (!deductibleType || !amount || !deductibleDate || !insuranceId) {
            return res.status(400).json({
                message: "Required fields are missing",
                missingFields: [
                    !deductibleType && "deductibleType",
                    !amount && "amount",
                    !deductibleDate && "deductibleDate",
                    !insuranceId && "insuranceId",
                ].filter(Boolean),
            });
        }

        const result = await prisma.deductible.create({
            data: {
                deductibleType,
                amount: parseFloat(amount),
                deductibleDate: new Date(deductibleDate),
                insuranceId,
            },
        });

        res.status(201).json({
            message: "Deductible added successfully!",
            deductible: result,
        });
    } catch (error) {
        console.error("Error adding deductible:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const parseCustomDate = (dateString) => {
    if (!dateString) return null;

    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [time, period] = timePart.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours);
    if (period === "PM" && hours !== 12) {
        hours += 12;
    }
    if (period === "AM" && hours === 12) {
        hours = 0;
    }

    // Return ISO Date
    return new Date(`${year}-${month}-${day}T${hours.toString().padStart(2, '0')}:${minutes}:00.000Z`);
};

const addPatientWithDynamicData = async (req, res) => {
    try {
        const {
            visitType = "Consultation",
            referralCase,
            referredBy,
            existing,
            patientType,
            registrationDate,
            patientPriority,
            patientFullName,
            dob,
            age,
            gender,
            nationality,
            emailId,
            maritalStatus,
            visaType,
            nationalId,
            idType,
            idNumber,
            mobile,
            work,
            landPhone,
            wMobile,
            preferredLanguage, 
            occupation,
            infoSource,
            emirates,
            place,
            mainDistrict,
            district,
            area,
            address,
            hasanaId,
            companyName,
            empId,
            patientRemark,
            emPerson,
            emNumber,
            relationship,
            alert,
            specialty,
            doctorName,
            encounterType,
            paymentType,
            corporateName,
            dynamicFieldData,
            insuranceData, // Adding the insurance data field
        } = req.body;

        // Validate mandatory fields
        const requiredFields = [
            "visitType", "existing", "patientPriority", "patientFullName", "dob", "age",
            "gender", "nationality", "emailId", "maritalStatus", "visaType", "nationalId",
            "idType", "idNumber", "mobile", "occupation", "infoSource", "emirates", "place",
            "mainDistrict", "district", "area", "address", "companyName", "specialty",
            "doctorName", "paymentType"
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Required fields are missing",
                missingFields,
            });
        }

        const result = await prisma.$transaction(async (prisma) => {
            // Generate MRD Number
            const mrdNumber = `DLJ${Math.floor(Math.random() * 1000000).toString().padStart(7, "0")}`;

            // Convert Registration Date to ISO
            const isoRegistrationDate = parseCustomDate(registrationDate);

            // Ensure preferredLanguage is an array
            const languages = Array.isArray(preferredLanguage) ? preferredLanguage : [preferredLanguage];

            // Create the patient record
            const newPatient = await prisma.patient.create({
                data: {
                    mrdNumber,
                    visitType,
                    referralCase,
                    referredBy,
                    existing,
                    patientType,
                    registrationDate: isoRegistrationDate, // Save as ISO date
                    patientPriority,
                    patientFullName,
                    dob: new Date(dob),
                    age,
                    gender,
                    nationality,
                    emailId,
                    maritalStatus,
                    visaType,
                    nationalId,
                    idType,
                    idNumber,
                    mobile,
                    work,
                    landPhone,
                    wMobile,
                    preferredLanguage: languages, // Save as array
                    occupation,
                    infoSource,
                    emirates,
                    place,
                    mainDistrict,
                    district,
                    area,
                    address,
                    hasanaId,
                    companyName,
                    empId,
                    patientRemark,
                    emPerson,
                    emNumber,
                    relationship,
                    alert,
                    specialty,
                    doctorName,
                    encounterType,
                    paymentType,
                    corporateName,
                },
            });

            // Process dynamic fields if provided
            if (dynamicFieldData && Object.keys(dynamicFieldData).length > 0) {
                for (const [fieldName, value] of Object.entries(dynamicFieldData)) {
                    const field = await prisma.dynamicField.findUnique({
                        where: { field_name: fieldName },
                    });
                    if (field) {
                        await prisma.patientDynamicField.create({
                            data: {
                                patientId: newPatient.id,
                                dynamicFieldId: field.id,
                                value: value || "",
                            },
                        });
                    }
                }
            }

            // Add Insurance information if provided
            if (insuranceData && Array.isArray(insuranceData)) {
                for (const insurance of insuranceData) {
                    const {
                        insuranceProvider,
                        subInsurance,
                        networkType,
                        insuranceCardNumber,
                        extraCardNumber,
                        insuranceEffectiveDate,
                        insuranceExpiryDate,
                        certificateNo,
                        dependentsNo = 0,
                        insuranceClaimNo,
                        maxInsuranceLiability,
                        insuranceApprovalLimit,
                        maxInsuranceCoPay,
                        coPayPatient,
                    } = insurance;

                    await prisma.insurance.create({
                        data: {
                            insuranceProvider,
                            subInsurance,
                            networkType,
                            insuranceCardNumber,
                            extraCardNumber,
                            insuranceEffectiveDate: new Date(insuranceEffectiveDate),
                            insuranceExpiryDate: new Date(insuranceExpiryDate),
                            certificateNo,
                            dependentsNo,
                            insuranceClaimNo,
                            maxInsuranceLiability: parseFloat(maxInsuranceLiability),
                            insuranceApprovalLimit: parseFloat(insuranceApprovalLimit),
                            maxInsuranceCoPay: parseFloat(maxInsuranceCoPay),
                            coPayPatient: parseFloat(coPayPatient),
                            patientId: newPatient.id, // Link to the created patient
                        },
                    });
                }
            }

            return newPatient;
        });

        res.status(201).json({
            message: "Patient and dynamic data created successfully!",
            patient: result,
        });
    } catch (error) {
        console.error("Error creating patient with dynamic data:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// const getPatientDynamicFields = async (req, res) => {
//     const { staffId } = req.params;

//     try {
//         // Fetch staff data along with dynamic fields and their associated dynamic field details
//         const staffData = await prisma.staff.findUnique({
//             where: { staffId: staffId },
//             include: {
//                 staff_dynamic_field: {
//                     include: {
//                         dynamic_field: true,
//                     },
//                 },
//             },
//         });

//         if (!staffData) {
//             return res.status(404).json({ message: "Staff not found" });
//         }

//         const transformedDynamicFields = staffData.staff_dynamic_field.map(
//             (field) => ({
//                 id: field.id,
//                 staff_id: field.staff_id,
//                 dynamicFieldId: field.dynamicFieldId,
//                 value: field.value,
//                 field_name: field.dynamic_field.field_name,
//             })
//         );

//         const response = {
//             ...staffData,
//             staff_dynamic_field: transformedDynamicFields,
//         };

//         return res.status(200).json(response);
//     } catch (error) {
//         console.error(error);
//         return res
//             .status(500)
//             .json({ message: "Error fetching staff data with dynamic fields" });
//     }
// };

const deleteDynamicField = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Field ID is required." });
        }

        // Convert ID to a Number
        const fieldId = Number(id);

        const deletedField = await prisma.dynamicField.delete({
            where: { id: fieldId },
        });

        if (!deletedField) {
            return res.status(404).json({ error: "Field not found!" });
        }

        return res.status(200).json({
            message: "Dynamic field deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting dynamic field:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

const verifyInsurance = async (req, res) => {
    const { insuranceId } = req.body;

    if (!insuranceId || insuranceId.length !== 25) {
        return res.status(400).json({ message: "Invalid insurance ID" });
    }

    try {
        const insuranceApiUrl = "/";

        const response = await fetch(insuranceApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ insuranceId }),
        });

        if (!response.ok) {
            return res.status(400).json({ message: "Insurance verification failed." });
        }

        const data = await response.json();

        if (data.eligible) {
            res.status(200).json({ message: "Successfully verified." });
        } else {
            res.status(400).json({ message: "Insurance verification failed." });
        }
    } catch (error) {
        console.error("Error verifying insurance:", error.message);
        res
            .status(500)
            .json({ message: "Failed to verify insurance. Please try again." });
    }
};


module.exports = {
    addDynamicFields,
    getDynamicFields,
    addPatientWithDynamicData,
    deleteDynamicField,
    verifyInsurance,
    addInsurance,
    addDeductible,
};