const express = require("express");
const router = express.Router();

const resourceTypeController = require("../../../controllers/MasterData/GeneralSettings/resourceTypeController");

router.post("/resource-types", resourceTypeController.addResourceType);
router.put("/resource-types/:id", resourceTypeController.updateResourceType);
router.delete("/resource-types/:id", resourceTypeController.deleteResourceType);
router.get("/resource-types", resourceTypeController.getAllResourceTypes);

module.exports = router;