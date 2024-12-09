const express = require('express');
const { handleNewUser, getAllUsers, editUser, updateUserStatus } = require('../controllers/addUserController');
const router = express.Router();

router.post('/adduser', handleNewUser);
router.get('/users', getAllUsers);
router.put('/users/:empId', editUser);
router.patch('/users/:empId/status', updateUserStatus);


module.exports = router;
