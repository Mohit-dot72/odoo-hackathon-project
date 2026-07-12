const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getTrips)
  .post(authorize('Admin', 'Fleet Manager'), createTrip);

router
  .route('/:id')
  .get(getTrip)
  .put(authorize('Admin', 'Fleet Manager', 'Driver'), updateTrip)
  .delete(authorize('Admin'), deleteTrip);

module.exports = router;
