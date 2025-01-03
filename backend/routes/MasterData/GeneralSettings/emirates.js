const express = require('express');
const router = express.Router();

const emiratesController = require('../../../controllers/MasterData/GeneralSettings/emiratesController');

router.get('/emirates', emiratesController.getAllEmirates);
router.post('/emirates', emiratesController.addEmirates);
router.put('/emirates/:id', emiratesController.updateEmirates);
router.delete('/emirates/:id', emiratesController.removeEmirates);

module.exports = router;