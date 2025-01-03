const express = require("express");
const router = express.Router();

const communityController = require('../../../controllers/MasterData/GeneralSettings/communityController');

router.get('/communities', communityController.getAllCommunities);
router.post('/communities', communityController.addCommunity);
router.put('/communities/:id', communityController.updateCommunity);
router.delete('/communities/:id', communityController.removeCommunity);

module.exports = router;