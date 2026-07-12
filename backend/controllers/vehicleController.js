const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const { createNotification } = require('../utils/notificationHelper');

// Check and trigger insurance alert if expiry within 30 days
const checkInsuranceAlert = async (vehicle) => {
  const expiry = new Date(vehicle.insuranceExpiry);
  const today = new Date();
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 30 && diffDays > 0) {
    await createNotification({
      title: 'Insurance Expiration Warning',
      message: `Vehicle ${vehicle.regNumber} insurance expires in ${diffDays} days on ${expiry.toLocaleDateString()}.`,
      type: 'Alert',
    });
  } else if (diffDays <= 0) {
    await createNotification({
      title: 'Insurance Expired Alert',
      message: `Vehicle ${vehicle.regNumber} insurance expired on ${expiry.toLocaleDateString()}! Please renew immediately.`,
      type: 'Alert',
    });
  }
};

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
exports.getVehicles = async (req, res, next) => {
  try {
    const { search, status, type, sortBy, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search filter (regNumber, name, model)
    if (search) {
      query.$or = [
        { regNumber: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sortBy) {
      const parts = sortBy.split(':');
      sortObj[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .populate('assignedDriver')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: vehicles.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('assignedDriver');
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private (Admin, Fleet Manager)
exports.createVehicle = async (req, res, next) => {
  try {
    // Check if regNumber already exists
    const existing = await Vehicle.findOne({ regNumber: req.body.regNumber });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Vehicle registration number already exists' });
    }

    // If image was uploaded, store the URL
    if (req.file) {
      req.body.imageUrl = req.file.url;
    }

    const vehicle = await Vehicle.create(req.body);

    // Handle assigned driver
    if (req.body.assignedDriver) {
      const driver = await Driver.findById(req.body.assignedDriver);
      if (driver) {
        driver.assignedVehicle = vehicle._id;
        await driver.save();
      }
    }

    await checkInsuranceAlert(vehicle);

    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin, Fleet Manager)
exports.updateVehicle = async (req, res, next) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    // If image uploaded
    if (req.file) {
      req.body.imageUrl = req.file.url;
    }

    const oldDriverId = vehicle.assignedDriver;
    const newDriverId = req.body.assignedDriver;

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Handle Driver assignment changes
    if (newDriverId !== undefined && String(oldDriverId) !== String(newDriverId)) {
      // Free old driver
      if (oldDriverId) {
        await Driver.findByIdAndUpdate(oldDriverId, { assignedVehicle: null });
      }
      // Assign new driver
      if (newDriverId) {
        await Driver.findByIdAndUpdate(newDriverId, { assignedVehicle: vehicle._id });
      }
    }

    await checkInsuranceAlert(vehicle);

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Vehicle not found' });
    }

    // Free assigned driver
    if (vehicle.assignedDriver) {
      await Driver.findByIdAndUpdate(vehicle.assignedDriver, { assignedVehicle: null });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
};
