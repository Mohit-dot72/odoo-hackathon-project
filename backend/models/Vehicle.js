const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    regNumber: {
      type: String,
      required: [true, 'Please add a registration number'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a vehicle name'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please add a vehicle model'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify vehicle type'],
      enum: ['Truck', 'Van', 'Bus', 'Car'],
      default: 'Truck',
    },
    capacity: {
      type: Number,
      required: [true, 'Please add cargo/seating capacity'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please specify fuel type'],
      enum: ['Diesel', 'Petrol', 'CNG', 'Electric'],
      default: 'Diesel',
    },
    odometer: {
      type: Number,
      required: [true, 'Please specify the current odometer reading'],
      default: 0,
    },
    insuranceExpiry: {
      type: Date,
      required: [true, 'Please add insurance expiry date'],
    },
    rcBookUrl: {
      type: String,
      default: '',
    },
    pollutionCertUrl: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'In Maintenance', 'Out of Service'],
      default: 'Active',
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseModel = mongoose.model('Vehicle', VehicleSchema);
const MockModel = require('../utils/mockModel');
const vehicleMock = new MockModel('vehicles');

module.exports = new Proxy(mongooseModel, {
  get(target, prop, receiver) {
    if (global.useMemoryDB) {
      return vehicleMock[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

