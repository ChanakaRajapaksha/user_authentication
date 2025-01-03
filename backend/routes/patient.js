const express = require("express");
const router = express.Router();

const {
    addDynamicFields,
    getDynamicFields,
    addPatientWithDynamicData,
    deleteDynamicField,
    addInsurance,
    addDeductible,
} = require("../controllers/patientRegisterController");
const {
    savePatientPreRegistration,
    getAllPatientPreDetails,
    getPatientPreDetails,
    getPreRegistrations,
    editPreRegistration,
    confirmArrival,
    addPatientNote,
} = require("../controllers/patientPreRegistrationController");

// Dynamic Fields Routes
router.post("/add-dynamic-fields", addDynamicFields);
router.get("/", getDynamicFields);
router.delete("/add-dynamic-fields/:id", deleteDynamicField);

// Patient Routes
router.post("/add-patient-dynamic", addPatientWithDynamicData);
// router.get('/:patientId', getPatientDynamicFields);

// Insurance and Deductible Routes
router.post("/add-insurance", addInsurance);
router.post("/add-deductible", addDeductible);

// Pre-Registration Routes
router.post("/pre-register", savePatientPreRegistration);
router.get("/pre-patients", getAllPatientPreDetails);
router.get("/pre-patients/:id", getPatientPreDetails);
router.get("/pre-registrations-list", getPreRegistrations);
router.patch("/pre-registrations/:id/edit", editPreRegistration);
router.patch("/pre-registrations/:id/confirm-arrival", confirmArrival);
router.patch("/pre-registrations/:id/add-note", addPatientNote);

module.exports = router;