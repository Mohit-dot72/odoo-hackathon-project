const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a driver name'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'Please add a driver license number'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add a contact phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      trim: true,
      lowercase: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please add experience in years'],
      default: 0,
    },
    safetyScore: {
      type: Number,
      required: [true, 'Please specify the driver safety score'],
      min: 0,
      max: 100,
      default: 90,
    },
    availability: {
      type: String,
      enum: ['Available', 'On Trip', 'On Leave'],
      default: 'Available',
    },
    licenseUrl: {
      type: String,
      default: '',
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseModel = mongoose.model('Driver', DriverSchema);
const MockModel = require('../utils/mockModel');
const driverMock = new MockModel('drivers');

module.exports = new Proxy(mongooseModel, {
  get(target, prop, receiver) {
    if (global.useMemoryDB) {
      return driverMock[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

