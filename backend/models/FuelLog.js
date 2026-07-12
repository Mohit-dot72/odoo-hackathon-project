const mongoose = require('mongoose');

const FuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Please select a vehicle'],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    quantity: {
      type: Number, // in liters
      required: [true, 'Please add fuel quantity in liters'],
    },
    cost: {
      type: Number, // total cost of refuel
      required: [true, 'Please add fuel cost'],
    },
    odometer: {
      type: Number,
      required: [true, 'Please add odometer reading at refuel'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify refuel date'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseModel = mongoose.model('FuelLog', FuelLogSchema);
const MockModel = require('../utils/mockModel');
const fuelLogMock = new MockModel('fuelLogs');

module.exports = new Proxy(mongooseModel, {
  get(target, prop, receiver) {
    if (global.useMemoryDB) {
      return fuelLogMock[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

