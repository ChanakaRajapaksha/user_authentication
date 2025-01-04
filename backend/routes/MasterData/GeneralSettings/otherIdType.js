const express = require("express");
const router = express.Router();

const otherIdController = require("../../../controllers/MasterData/GeneralSettings/otherIdController");

router.post("/other-ids", otherIdController.createOtherID);
router.get("/other-ids", otherIdController.getAllOtherIDs);
router.put("/other-ids/:id", otherIdController.updateOtherID);
router.delete("/other-ids/:id", otherIdController.deleteOtherID);

module.exports = router;
