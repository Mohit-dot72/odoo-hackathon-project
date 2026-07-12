const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      required: true,
      enum: ['Vehicle', 'Driver', 'Trip', 'Fuel', 'Expense', 'Maintenance'],
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
      enum: ['CSV', 'PDF'],
    },
  },
  {
    timestamps: true,
  }
);

const mongooseModel = mongoose.model('Report', ReportSchema);
const MockModel = require('../utils/mockModel');
const reportMock = new MockModel('reports');

module.exports = new Proxy(mongooseModel, {
  get(target, prop, receiver) {
    if (global.useMemoryDB) {
      return reportMock[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

