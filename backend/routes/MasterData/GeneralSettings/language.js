const express = require('express');
const router = express.Router();

const languageController = require('../../../controllers/MasterData/GeneralSettings/languageController');

router.post("/languages", languageController.addLanguage);
router.put("/languages/:id", languageController.updateLanguage);
router.delete("/languages/:id", languageController.deleteLanguage);
router.patch("/languages/:id/toggle", languageController.toggleLanguageStatus);
router.get("/languages/enabled", languageController.getEnabledLanguages);
router.get("/languages", languageController.getAllLanguages);

module.exports = router;