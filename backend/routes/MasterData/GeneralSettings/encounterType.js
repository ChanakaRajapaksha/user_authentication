const express = require("express");
const router = express.Router();

const encounterTypeController =  require("../../../controllers/MasterData/GeneralSettings/encounterTypeController");

router.post("/encounter-types", encounterTypeController.createEncounterType);
router.get("/encounter-types", encounterTypeController.getAllEncounterTypes);
router.put("/encounter-types/:id", encounterTypeController.updateEncounterType);
router.delete("/encounter-types/:id", encounterTypeController.deleteEncounterType);

module.exports = router;
