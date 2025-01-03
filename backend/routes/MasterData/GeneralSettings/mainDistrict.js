const express = require('express');
const router = express.Router();

const mainDistrictController = require('../../../controllers/MasterData/GeneralSettings/mainDistrictController');

router.get('/main-districts', mainDistrictController.getAllMainDistricts);
router.post('/main-districts', mainDistrictController.addMainDistrict);
router.put('/main-districts/:id', mainDistrictController.updateMainDistrict);
router.delete('/main-districts/:id', mainDistrictController.removeMainDistrict);

module.exports = router;