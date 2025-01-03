const express = require("express");
const router = express.Router();

const scheduleTypeController = require('../../../controllers/MasterData/GeneralSettings/scheduleTypeController');

router.get('/schedule-types', scheduleTypeController.getAllScheduleTypes);
router.post('/schedule-type', scheduleTypeController.addScheduleType);
router.get('/schedule-type/:id', scheduleTypeController.getScheduleTypeById);
router.put('/schedule-type/:id', scheduleTypeController.updateScheduleType);
router.delete('/schedule-type/:id', scheduleTypeController.deleteScheduleType);

module.exports = router;