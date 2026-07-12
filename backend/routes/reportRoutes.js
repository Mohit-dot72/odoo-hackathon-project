const express = require('express');
const router = express.Router();
const { exportReport, getReports } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/export', exportReport);
router.get('/', authorize('Admin', 'Fleet Manager', 'Financial Analyst'), getReports);

module.exports = router;
