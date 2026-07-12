const express = require('express');
const router = express.Router();
const {
  getFuelLogs,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
} = require('../controllers/fuelController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getFuelLogs)
  .post(authorize('Admin', 'Fleet Manager', 'Driver', 'Financial Analyst'), createFuelLog);

router
  .route('/:id')
  .put(authorize('Admin', 'Fleet Manager', 'Financial Analyst'), updateFuelLog)
  .delete(authorize('Admin'), deleteFuelLog);

module.exports = router;
