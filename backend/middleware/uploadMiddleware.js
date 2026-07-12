const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (accept images, PDFs, etc.)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and Word documents are allowed!'));
  }
};

const upload = multer({
  storage: localStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

// Middleware helper to handle local file upload, then optionally push to Cloudinary
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      if (!req.file) {
        return next();
      }

      // If Cloudinary is configured, upload it
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'transitops',
            resource_type: 'auto',
          });
          // Delete local file after upload to Cloudinary
          fs.unlinkSync(req.file.path);
          req.file.url = result.secure_url;
          req.file.public_id = result.public_id;
        } catch (cloudErr) {
          console.error('Cloudinary upload failure, keeping local file:', cloudErr.message);
          req.file.url = `/uploads/${req.file.filename}`;
        }
      } else {
        // Fallback: file URL is static path
        req.file.url = `/uploads/${req.file.filename}`;
      }

      next();
    });
  };
};

module.exports = { uploadSingle };
