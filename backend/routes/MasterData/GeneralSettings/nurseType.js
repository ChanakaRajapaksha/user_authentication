const express = require("express");
const router = express.Router();

const nurseTypeController = require("../../../controllers/MasterData/GeneralSettings/nurseTypeController");

router.post("/nurse-types", nurseTypeController.addNurseType);
router.put("/nurse-types/:id", nurseTypeController.updateNurseType);
router.delete("/nurse-types/:id", nurseTypeController.deleteNurseType);
router.get("/nurse-types", nurseTypeController.getAllNurseTypes);

module.exports = router;
