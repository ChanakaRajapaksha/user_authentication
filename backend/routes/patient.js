const express = require('express');
const router = express.Router();

const { handleNewPatient, getAllPatients, getPatientDetails } = require('../controllers/patientRegisterController');

router.post('/patient-register', handleNewPatient);
router.get('/patients', getAllPatients);
router.get('/patients/:patientId', getPatientDetails);

module.exports = router;
