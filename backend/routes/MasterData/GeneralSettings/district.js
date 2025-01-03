const express = require('express');
const router = express.Router();

const districtController = require('../../../controllers/MasterData/GeneralSettings/districtController');

router.get('/districts', districtController.getAllDistricts);
router.post('/districts', districtController.addDistrict);
router.put('/districts/:id', districtController.updateDistrict);
router.delete('/districts/:id', districtController.removeDistrict);

module.exports = router;