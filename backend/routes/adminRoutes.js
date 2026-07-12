const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getUsers,
  updateUser,
  deleteUser,
  approveDriver,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Analytics accessible by Admin, Fleet Manager, Financial Analyst, Safety Officer
router.get('/analytics', authorize('Admin', 'Fleet Manager', 'Financial Analyst', 'Safety Officer'), getAnalytics);

// User CRUD restricted to Admin only
router
  .route('/users')
  .get(authorize('Admin'), getUsers);

router
  .route('/users/:id')
  .put(authorize('Admin'), updateUser)
  .delete(authorize('Admin'), deleteUser);

// Driver approval
router.put('/drivers/:id/approve', authorize('Admin', 'Fleet Manager'), approveDriver);

module.exports = router;
