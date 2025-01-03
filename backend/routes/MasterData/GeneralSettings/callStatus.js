const express = require('express');
const router = express.Router();

const callStatusController = require('../../../controllers/MasterData/GeneralSettings/callStatusController');

router.get('/call-status', callStatusController.getAllCallStatus);
router.post('/call-status', callStatusController.addCallStatus);
router.put('/call-status/:id', callStatusController.updateCallStatus);
router.delete('/call-status/:id', callStatusController.removeCallStatus);

module.exports = router;