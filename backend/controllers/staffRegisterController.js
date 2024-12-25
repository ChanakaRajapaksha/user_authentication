const prisma = require('../database/prismaClient');

// const addStaff = async (req, res) => {
//     try {
//       const {
//         role,
//         designation,
//         department,
//         specialist,
//         firstName,
//         lastName,
//         fatherName,
//         motherName,
//         gender,
//         maritalStatus,
//         bloodGroup,
//         dateOfBirth,
//         dateOfJoining,
//         phone,
//         emergencyContact,
//         email,
//         photo,
//         currentAddress,
//         permanentAddress,
//         qualification,
//         workExperience,
//         specialization,
//         note,
//         panNumber,
//         nationalIDNumber,
//         localIDNumber,
//         referenceContact,
//       } = req.body;

//       // Validate mandatory fields
//       if (!role || !gender || !dateOfBirth || !email) {
//         return res.status(400).json({ message: 'Required fields are missing!' });
//       }

//       // Create the staff record
//       const newStaff = await prisma.staff.create({
//         data: {
//           role,
//           designation,
//           department,
//           specialist,
//           firstName,
//           lastName,
//           fatherName,
//           motherName,
//           gender,
//           maritalStatus,
//           bloodGroup,
//           dateOfBirth: new Date(dateOfBirth),
//           dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
//           phone,
//           emergencyContact,
//           email,
//           photo,
//           currentAddress,
//           permanentAddress,
//           qualification,
//           workExperience,
//           specialization,
//           note,
//           panNumber,
//           nationalIDNumber,
//           localIDNumber,
//           referenceContact,
//         },
//       });

//       res.status(201).json({
//         message: 'Staff member created successfully!',
//         staff: newStaff,
//       });
//     } catch (error) {
//       console.error('Error creating staff:', error);
//       res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
//   };

const addDynamicFields = async (req, res) => {
    try {
        const fields = req.body;

        if (!Array.isArray(fields) || fields.length === 0) {
            return res.status(400).json({
                error: 'Input should be a non-empty array of fields',
            });
        }

        const addedFields = [];
        for (const field of fields) {
            const { field_name, field_type, dropdown_options } = field;

            if (!field_name || !field_type) {
                return res.status(400).json({
                    error: 'All fields are required: field_name, field_type',
                });
            }

            if (field_type === 'dropdown' && (!dropdown_options || dropdown_options.length === 0)) {
                return res.status(400).json({
                    error: 'Dropdown fields must include non-empty dropdown_options',
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
                        dropdown_options: dropdown_options ? JSON.stringify(dropdown_options) : null, // Save as JSON string
                    },
                });
                addedFields.push(newDynamicField);
            } else {
                addedFields.push(existingDynamicField);
            }
        }

        return res.status(201).json({
            message: 'Dynamic fields added successfully',
            data: addedFields.map((field) => ({
                ...field,
                dropdown_options: field.dropdown_options
                    ? JSON.parse(field.dropdown_options)
                    : null,
            })),
        });
    } catch (error) {
        console.error('Error adding dynamic fields:', error);
        return res.status(500).json({ error: 'Internal server error.' });
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

const addStaffWithDynamicData = async (req, res) => {
    try {
        const {
            staffId,
            role,
            designation,
            department,
            specialist,
            firstName,
            lastName,
            fatherName,
            motherName,
            gender,
            maritalStatus,
            bloodGroup,
            dateOfBirth,
            dateOfJoining,
            phone,
            emergencyContact,
            email,
            photo,
            currentAddress,
            permanentAddress,
            qualification,
            workExperience,
            specialization,
            note,
            panNumber,
            nationalIDNumber,
            localIDNumber,
            referenceContact,
            dynamicFieldData,
        } = req.body;

        // Validate mandatory fields
        if (!role || !gender || !dateOfBirth || !email || !firstName) {
            return res.status(400).json({ message: 'Required fields are missing!' });
        }

        const result = await prisma.$transaction(async (prisma) => {
            // Create the staff record
            const newStaff = await prisma.staff.create({
                data: {
                    staffId,
                    role,
                    designation,
                    department,
                    specialist,
                    firstName,
                    lastName,
                    fatherName,
                    motherName,
                    gender,
                    maritalStatus,
                    bloodGroup,
                    dateOfBirth: new Date(dateOfBirth),
                    dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
                    phone,
                    emergencyContact,
                    email,
                    photo,
                    currentAddress,
                    permanentAddress,
                    qualification,
                    workExperience,
                    specialization,
                    note,
                    panNumber,
                    nationalIDNumber,
                    localIDNumber,
                    referenceContact,
                },
            });

            // Process dynamic fields if provided
            if (dynamicFieldData && Object.keys(dynamicFieldData).length > 0) {
                for (const [fieldName, value] of Object.entries(dynamicFieldData)) {
                    const field = await prisma.dynamicField.findUnique({
                        where: { field_name: fieldName },
                    });
                    if (field) {
                        await prisma.staffDynamicField.create({
                            data: {
                                staff_id: newStaff.staffId,
                                dynamicFieldId: field.id,
                                value: value || "",
                            },
                        });
                    }
                }
            }

            return newStaff;
        });

        res.status(201).json({
            message: 'Staff member and dynamic data created successfully!',
            staff: result,
        });
    } catch (error) {
        console.error('Error creating staff with dynamic data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// const saveStaffData = async (req, res) => {
//     try {
//         const { staffId, dynamicFieldData } = req.body;

//         // Example `dynamicFieldData` structure:
//         // { "height": "180", "weight": "75", "blood_pressure": "120/80" }

//         for (const [fieldName, value] of Object.entries(dynamicFieldData)) {
//             const field = await prisma.dynamicField.findUnique({
//                 where: { field_name: fieldName },
//             });

//             if (field) {
//                 await prisma.staffDynamicField.create({
//                     data: {
//                         staffId, 
//                         dynamicFieldId: field.id,
//                         value, 
//                     },
//                 });
//             }
//         }

//         return res.status(201).json({ message: "Staff data saved successfully." });
//     } catch (error) {
//         console.error("Error saving patient data:", error);
//         return res.status(500).json({ error: "Internal server error." });
//     }
// };

const getStaffDynamicFields = async (req, res) => {
    const { staffId } = req.params;

    try {
        // Fetch staff data along with dynamic fields and their associated dynamic field details
        const staffData = await prisma.staff.findUnique({
            where: { staffId: staffId },
            include: {
                staff_dynamic_field: {
                    include: {
                        dynamic_field: true,
                    },
                },
            },
        });

        if (!staffData) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        const transformedDynamicFields = staffData.staff_dynamic_field.map((field) => ({
            id: field.id,
            staff_id: field.staff_id,
            dynamicFieldId: field.dynamicFieldId,
            value: field.value,
            field_name: field.dynamic_field.field_name,
        }));

        const response = {
            ...staffData,
            staff_dynamic_field: transformedDynamicFields,
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching staff data with dynamic fields' });
    }
};

const deleteDynamicField = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Field ID is required.' });
        }

        // Convert ID to a Number
        const fieldId = Number(id)

        const deletedField = await prisma.dynamicField.delete({
            where: { id: fieldId },
        });

        if (!deletedField) {
            return res.status(404).json({ error: "Field not found!" })
        }

        return res.status(200).json({
            message: 'Dynamic field deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting dynamic field:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    addDynamicFields,
    getDynamicFields,
    addStaffWithDynamicData,
    getStaffDynamicFields,
    deleteDynamicField
};