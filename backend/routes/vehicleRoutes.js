const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getVehicles)
  .post(authorize('Admin', 'Fleet Manager'), uploadSingle('image'), createVehicle);

router
  .route('/:id')
  .get(getVehicle)
  .put(authorize('Admin', 'Fleet Manager'), uploadSingle('image'), updateVehicle)
  .delete(authorize('Admin'), deleteVehicle);

module.exports = router;
