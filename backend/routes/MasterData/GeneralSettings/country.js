const express = require("express");
const router = express.Router();

const countryController = require('../../../controllers/MasterData/GeneralSettings/countryController');

router.get('/countries/search', countryController.searchCountry);
router.post('/countries', countryController.addCountry);
router.get('/countries', countryController.getAllCountries);
router.put('/country/:id', countryController.updateCountry);
router.delete('/country/:id', countryController.deleteCountry);

module.exports = router;