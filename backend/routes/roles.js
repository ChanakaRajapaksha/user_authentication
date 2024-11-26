const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const router = express.Router();

router.get('/dashboard', verifyJWT, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only.' });
    }
    res.json({ message: 'Welcome Admin!' });
});

router.get('/doctor', verifyJWT, (req, res) => {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Doctors only.' });
    }
    res.json({ message: `Welcome ${req.user.role === 'admin' ? 'Admin' : 'Doctor'}!` });
});

module.exports = router;
