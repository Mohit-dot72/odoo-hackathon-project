const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const cloudinary = require('../config/cloudinary');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Upload new document
// @route   POST /api/documents
// @access  Private
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const { name, type, expiryDate } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, error: 'Please provide document name and type' });
    }

    const document = await Document.create({
      name,
      type,
      fileUrl: req.file.url,
      uploadedBy: req.user._id,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    await createNotification({
      title: 'Document Uploaded',
      message: `A new document "${name}" (${type}) was uploaded successfully by ${req.user.name}.`,
      type: 'Info',
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res, next) => {
  try {
    const { search, type } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    const documents = await Document.find(query).populate('uploadedBy').sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const fileUrl = document.fileUrl;

    // Check if stored locally or on Cloudinary
    if (fileUrl.startsWith('/uploads/')) {
      const filename = fileUrl.replace('/uploads/', '');
      const filepath = path.join(__dirname, '../uploads/', filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } else if (fileUrl.includes('res.cloudinary.com')) {
      // Delete from Cloudinary if possible
      // Cloudinary format public_id extraction or ignore
      console.log('Deleting from Cloudinary directory:', fileUrl);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};
