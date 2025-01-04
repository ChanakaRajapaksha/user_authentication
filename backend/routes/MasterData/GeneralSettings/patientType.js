const express = require("express");
const router = express.Router();

const patientTypeController = require("../../../controllers/MasterData/GeneralSettings/patientTypeController");

router.post("/patient-types", patientTypeController.addPatientType);
router.put("/patient-types/:id", patientTypeController.updatePatientType);
router.delete("/patient-types/:id", patientTypeController.deletePatientType);
router.get("/patient-types", patientTypeController.getAllPatientTypes);

module.exports = router;
