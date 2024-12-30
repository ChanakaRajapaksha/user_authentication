const express = require('express');
const router = express.Router();

const {
    addDynamicFields,
    getDynamicFields,
    addPatientWithDynamicData,
    deleteDynamicField,
    addInsurance,
    addDeductible
} = require('../controllers/patientRegisterController');

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

module.exports = router;
