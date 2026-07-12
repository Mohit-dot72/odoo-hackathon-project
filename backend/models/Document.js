const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a document name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify document type'],
      enum: ['Insurance', 'RC Book', 'Driver License', 'Fitness Certificate', 'Pollution Certificate'],
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide the document file URL'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseModel = mongoose.model('Document', DocumentSchema);
const MockModel = require('../utils/mockModel');
const documentMock = new MockModel('documents');

module.exports = new Proxy(mongooseModel, {
  get(target, prop, receiver) {
    if (global.useMemoryDB) {
      return documentMock[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

