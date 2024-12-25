const express = require('express');
const router = express.Router();

const { addDynamicFields, getDynamicFields, addStaffWithDynamicData, getStaffDynamicFields, deleteDynamicField } = require('../controllers/staffRegisterController');

// router.post("/add-staff", addStaff);
router.post("/add-dynamic-fields", addDynamicFields);
router.get("/", getDynamicFields)
router.post("/add-staff-dynamic", addStaffWithDynamicData);
router.get('/staff/:staffId', getStaffDynamicFields);
router.delete("/add-dynamic-fields/:id", deleteDynamicField);

module.exports = router;