const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    tripId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Please assign a vehicle for the trip'],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Please assign a driver for the trip'],
    },
    source: {
      type: String,
      required: [true, 'Please add a source location'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Please add a destination location'],
      trim: true,
    },
    distance: {
      type: Number,
      required: [true, 'Please specify the estimated distance in kilometers'],
    },
    cargoWeight: {
      type: Number,
      required: [true, 'Please specify cargo weight in tons'],
    },
    estDuration: {
      type: Number, // in hours
      required: [true, 'Please specify estimated duration in hours'],
    },
    status: {
      type: String,
      enum: ['Scheduled', 'On Trip', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseModel = mongoose.model('Trip', TripSchema);
const MockModel = require('../utils/mockModel');
const tripMock = new MockModel('trips');

module.exports = new Proxy(mongooseModel, {
  get(target, prop, receiver) {
    if (global.useMemoryDB) {
      return tripMock[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

