const express = require('express');
const router = express.Router();

const employmentTypeController = require('../../../controllers/MasterData/GeneralSettings/employmentTypeController');

router.get('/employment-types', employmentTypeController.getAllEmploymentTypes);
router.post('/employment-types', employmentTypeController.addEmploymentType);
router.put('/employment-types/:id', employmentTypeController.updateEmploymentType);
router.delete('/employment-types/:id', employmentTypeController.removeEmploymentType);

module.exports = router;