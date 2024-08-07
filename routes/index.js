const express = require('express');
const router = express.Router();

const authRoutes = require('./api/authRoutes');

router.use('/api', authRoutes);

module.exports = router;