const express = require("express");
const router = express.Router();

const patientPriorityController = require("../../../controllers/MasterData/GeneralSettings/patientPriorityController");

router.post("/patient-priorities", patientPriorityController.addPatientPriority);
router.put("/patient-priorities/:id", patientPriorityController.updatePatientPriority);
router.delete("/patient-priorities/:id", patientPriorityController.deletePatientPriority);
router.get("/patient-priorities", patientPriorityController.getAllPatientPriorities);

module.exports = router;
