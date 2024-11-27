const express = require('express');
const router = express.Router();

const { handleNewPatient } = require('../controllers/patientRegisterController');

router.post('/patient-register', handleNewPatient);

module.exports = router;
