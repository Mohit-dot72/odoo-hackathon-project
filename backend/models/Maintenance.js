const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Please select a vehicle'],
    },
    serviceType: {
      type: String,
      required: [true, 'Please specify service type'],
      enum: ['Routine', 'Repair', 'Breakdown', 'Inspection'],
      default: 'Routine',
    },
    description: {
      type: String,
      required: [true, 'Please add a service description'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please specify start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please specify estimated/actual end date'],
    },
    cost: {
      type: Number,
      required: [true, 'Please add service cost'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed'],
      default: 'Scheduled',
    },
  },
  {
    timestamps: true,
  }
);

const mongooseModel = mongoose.model('Maintenance', MaintenanceSchema);
const MockModel = require('../utils/mockModel');
const maintenanceMock = new MockModel('maintenance');

module.exports = new Proxy(mongooseModel, {
  get(target, prop, receiver) {
    if (global.useMemoryDB) {
      return maintenanceMock[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

