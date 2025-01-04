const express = require("express");
const router = express.Router();

const informationSourceController = require("../../../controllers/MasterData/GeneralSettings/informationSourceController");

router.post("/information-sources", informationSourceController.addInformationSource);
router.put("/information-sources/:id", informationSourceController.updateInformationSource);
router.delete("/information-sources/:id", informationSourceController.deleteInformationSource);
router.get("/information-sources", informationSourceController.getAllInformationSources);

module.exports = router;
