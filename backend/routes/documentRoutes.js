const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

router.use(protect);

router
  .route('/')
  .get(getDocuments)
  .post(uploadSingle('file'), uploadDocument);

router.delete('/:id', deleteDocument);

module.exports = router;
