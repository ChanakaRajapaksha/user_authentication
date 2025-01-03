const express = require("express");
const router = express.Router();

const appointmentStatusController = require('../../../controllers/MasterData/GeneralSettings/appointmentStatusController');

router.get('/statuses', appointmentStatusController.getAllStatuses);
router.post('/status', appointmentStatusController.addStatus);
router.get('/status/:id', appointmentStatusController.getStatusById);
router.put('/status/:id', appointmentStatusController.updateStatus);
router.delete('/status/:id', appointmentStatusController.deleteStatus);

module.exports = router;