const express = require('express');
const router = express.Router();
const {
  getMaintenances,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getMaintenances)
  .post(authorize('Admin', 'Fleet Manager'), createMaintenance);

router
  .route('/:id')
  .get(getMaintenance)
  .put(authorize('Admin', 'Fleet Manager'), updateMaintenance)
  .delete(authorize('Admin'), deleteMaintenance);

module.exports = router;
