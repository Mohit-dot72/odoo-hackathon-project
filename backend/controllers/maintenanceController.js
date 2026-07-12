const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const Expense = require('../models/Expense');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private
exports.getMaintenances = async (req, res, next) => {
  try {
    const { vehicle, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (vehicle) {
      query.vehicle = vehicle;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Maintenance.countDocuments(query);
    const records = await Maintenance.find(query)
      .populate('vehicle')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: records.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single maintenance record
// @route   GET /api/maintenance/:id
// @access  Private
exports.getMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findById(req.params.id).populate('vehicle');
    if (!record) {
      return res.status(404).json({ success: false, error: 'Maintenance record not found' });
    }
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Create maintenance record
// @route   POST /api/maintenance
// @access  Private (Admin, Fleet Manager)
exports.createMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.create(req.body);

    // If status is In Progress, update vehicle status
    if (record.status === 'In Progress') {
      await Vehicle.findByIdAndUpdate(record.vehicle, { status: 'In Maintenance' });
    }

    // Trigger maintenance registered alert
    const vehicle = await Vehicle.findById(record.vehicle);
    if (vehicle) {
      await createNotification({
        title: 'Maintenance Logged',
        message: `Maintenance scheduled for vehicle ${vehicle.regNumber}: ${record.serviceType}.`,
        type: 'Reminder',
      });
    }

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance record
// @route   PUT /api/maintenance/:id
// @access  Private (Admin, Fleet Manager)
exports.updateMaintenance = async (req, res, next) => {
  try {
    let record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Maintenance record not found' });
    }

    const prevStatus = record.status;
    const nextStatus = req.body.status;

    record = await Maintenance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('vehicle');

    // Handle status changes
    if (prevStatus !== nextStatus) {
      if (nextStatus === 'In Progress') {
        await Vehicle.findByIdAndUpdate(record.vehicle._id, { status: 'In Maintenance' });
      } else if (nextStatus === 'Completed') {
        // Reset vehicle status to Active
        await Vehicle.findByIdAndUpdate(record.vehicle._id, { status: 'Active' });

        // Add auto expense for maintenance
        await Expense.create({
          expenseType: 'Maintenance',
          vehicle: record.vehicle._id,
          cost: record.cost,
          description: `Completed Maintenance - ${record.serviceType}: ${record.description}`,
          date: record.endDate || new Date(),
        });

        await createNotification({
          title: 'Maintenance Completed',
          message: `Maintenance for vehicle ${record.vehicle.regNumber} completed. Cost of $${record.cost} recorded.`,
          type: 'Info',
        });
      }
    }

    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete maintenance record
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin)
exports.deleteMaintenance = async (req, res, next) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Maintenance record not found' });
    }

    // Reset vehicle status if maintenance deleted before completion
    if (record.status === 'In Progress') {
      await Vehicle.findByIdAndUpdate(record.vehicle, { status: 'Active' });
    }

    await Maintenance.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Maintenance record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
