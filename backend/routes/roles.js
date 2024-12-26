const express = require('express');
const verifyJWT = require('../middleware/verifyJWT');
const router = express.Router();

router.get('/super-dashboard', verifyJWT, (req, res) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Access denied: Super Admins only.' });
    }
    res.json({ message: 'Welcome Super Admin!' });
});

router.get('/dashboard', verifyJWT, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only.' });
    }
    res.json({ message: 'Welcome Admin!' });
});

router.get('/doctor-home', verifyJWT, (req, res) => {
    res.json({
        message: `Welcome ${req.user.role}!`,
        role: req.user.role,
    });
});

router.get('/mlt-home', verifyJWT, (req, res) => {
    res.json({
        message: `Welcome ${req.user.role}!`,
        role: req.user.role,
    });
});

router.get('/nurse-home', verifyJWT, (req, res) => {
    res.json({
        message: `Welcome ${req.user.role}!`,
        role: req.user.role,
    });
});

module.exports = router;