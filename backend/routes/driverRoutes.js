const express = require('express');
const router = express.Router();
const {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

router.use(protect);

router
  .route('/')
  .get(getDrivers)
  .post(authorize('Admin', 'Fleet Manager'), uploadSingle('license'), createDriver);

router
  .route('/:id')
  .get(getDriver)
  .put(authorize('Admin', 'Fleet Manager'), uploadSingle('license'), updateDriver)
  .delete(authorize('Admin'), deleteDriver);

module.exports = router;
