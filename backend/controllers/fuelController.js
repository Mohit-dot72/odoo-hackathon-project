const FuelLog = require('../models/FuelLog');
const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Get all fuel logs
// @route   GET /api/fuel
// @access  Private
exports.getFuelLogs = async (req, res, next) => {
  try {
    const { vehicle, page = 1, limit = 10 } = req.query;

    const query = {};
    if (vehicle) {
      query.vehicle = vehicle;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await FuelLog.countDocuments(query);
    const logs = await FuelLog.find(query)
      .populate('vehicle')
      .populate('driver')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create fuel log
// @route   POST /api/fuel
// @access  Private
exports.createFuelLog = async (req, res, next) => {
  try {
    const log = await FuelLog.create(req.body);

    const vehicle = await Vehicle.findById(log.vehicle);

    // Sync vehicle odometer if this reading is higher
    if (vehicle && log.odometer > vehicle.odometer) {
      vehicle.odometer = log.odometer;
      await vehicle.save();
    }

    // Automatically create corresponding general Expense of type 'Fuel'
    await Expense.create({
      expenseType: 'Fuel',
      vehicle: log.vehicle,
      cost: log.cost,
      description: `Fuel refill: ${log.quantity} liters at odo ${log.odometer}`,
      date: log.date || new Date(),
    });

    // Alert check: Trigger alert on high single fuel volume
    if (log.quantity > 250) {
      await createNotification({
        title: 'Fuel Overuse Alert',
        message: `High volume fuel refill detected: ${log.quantity} liters filled for vehicle ${vehicle ? vehicle.regNumber : ''}.`,
        type: 'Alert',
      });
    }

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Update fuel log
// @route   PUT /api/fuel/:id
// @access  Private (Admin, Fleet Manager)
exports.updateFuelLog = async (req, res, next) => {
  try {
    let log = await FuelLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Fuel log not found' });
    }

    const previousCost = log.cost;

    log = await FuelLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Update the corresponding Expense record
    await Expense.findOneAndUpdate(
      {
        expenseType: 'Fuel',
        vehicle: log.vehicle,
        cost: previousCost,
        date: log.date,
      },
      {
        cost: log.cost,
        description: `Fuel refill: ${log.quantity} liters at odo ${log.odometer} (Updated)`,
      }
    );

    res.status(200).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete fuel log
// @route   DELETE /api/fuel/:id
// @access  Private (Admin)
exports.deleteFuelLog = async (req, res, next) => {
  try {
    const log = await FuelLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, error: 'Fuel log not found' });
    }

    // Delete corresponding Expense log
    await Expense.findOneAndDelete({
      expenseType: 'Fuel',
      vehicle: log.vehicle,
      cost: log.cost,
      date: log.date,
    });

    await FuelLog.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Fuel log deleted successfully' });
  } catch (error) {
    next(error);
  }
};
