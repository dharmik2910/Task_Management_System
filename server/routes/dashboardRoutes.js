const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose'); // Needed for the controller usage if not imported there, wait I imported it in controller but missed it in file above.

router.get('/stats', protect, getDashboardStats);

module.exports = router;
