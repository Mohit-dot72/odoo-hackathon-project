const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    expenseType: {
      type: String,
      required: [true, 'Please specify expense type'],
      enum: ['Fuel', 'Maintenance', 'Toll', 'Insurance', 'Challan', 'Other'],
      default: 'Other',
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    cost: {
      type: Number,
      required: [true, 'Please specify expense cost'],
    },
    description: {
      type: String,
      required: [true, 'Please specify expense description'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please select expense date'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const mongooseModel = mongoose.model('Expense', ExpenseSchema);
const MockModel = require('../utils/mockModel');
const expenseMock = new MockModel('expenses');

module.exports = new Proxy(mongooseModel, {
  get(target, prop, receiver) {
    if (global.useMemoryDB) {
      return expenseMock[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

