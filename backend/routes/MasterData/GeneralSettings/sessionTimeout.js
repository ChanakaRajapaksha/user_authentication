const express = require("express");
const router = express.Router();

const sessionTimeoutController = require("../../../controllers/MasterData/GeneralSettings/sessionTimeOutController");

router.post("/session-timeouts", sessionTimeoutController.createSessionTimeout);
router.get("/session-timeouts", sessionTimeoutController.getAllSessionTimeouts);
router.get("/session-timeouts/enable", sessionTimeoutController.getEnabledSessionTimeouts);
router.put("/session-timeouts/:id", sessionTimeoutController.updateSessionTimeout);
router.delete("/session-timeouts/:id", sessionTimeoutController.deleteSessionTimeout);
router.patch("/session-timeouts/:id/toggle", sessionTimeoutController.toggleSessionTimeoutStatus);

module.exports = router;
