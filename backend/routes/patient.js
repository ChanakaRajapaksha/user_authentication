const express = require('express');
const router = express.Router();

const { addDynamicFields, getDynamicFields, addPatientWithDynamicData, getPatientDynamicFields, deleteDynamicField } = require('../controllers/patientRegisterController');

router.post("/add-dynamic-fields", addDynamicFields);
router.get("/", getDynamicFields)
router.post("/add-patient-dynamic", addPatientWithDynamicData);
router.get('/:patientId', getPatientDynamicFields);
router.delete("/add-dynamic-fields/:id", deleteDynamicField);

module.exports = router;