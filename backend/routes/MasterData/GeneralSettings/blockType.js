const express = require("express");
const router = express.Router();

const blockTypeController = require("../../../controllers/MasterData/GeneralSettings/blockTypeController");

router.post("/block-types", blockTypeController.createBlockType);
router.get("/block-types", blockTypeController.getAllBlockTypes);
router.put("/block-types/:id", blockTypeController.updateBlockType);
router.delete("/block-types/:id", blockTypeController.deleteBlockType);

module.exports = router;
