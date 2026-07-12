const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const { createNotification } = require('../utils/notificationHelper');

// Trigger score alert if score is low
const checkSafetyScoreAlert = async (driver) => {
  if (driver.safetyScore < 70) {
    await createNotification({
      title: 'Low Safety Score Alert',
      message: `Driver ${driver.name}'s safety score has fallen to ${driver.safetyScore}%. Please schedule safety counseling.`,
      type: 'Alert',
    });
  }
};

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private
exports.getDrivers = async (req, res, next) => {
  try {
    const { search, availability, sortBy, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search filter (name, licenseNumber, phone, email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Availability filter
    if (availability) {
      query.availability = availability;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sortBy) {
      const parts = sortBy.split(':');
      sortObj[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const total = await Driver.countDocuments(query);
    const drivers = await Driver.find(query)
      .populate('assignedVehicle')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: drivers.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: drivers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Private
exports.getDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id).populate('assignedVehicle');
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new driver
// @route   POST /api/drivers
// @access  Private (Admin, Fleet Manager)
exports.createDriver = async (req, res, next) => {
  try {
    // Check if license number exists
    const existing = await Driver.findOne({ licenseNumber: req.body.licenseNumber });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Driver license number already exists' });
    }

    // If license file uploaded, store the URL
    if (req.file) {
      req.body.licenseUrl = req.file.url;
    }

    const driver = await Driver.create(req.body);

    // Handle assigned vehicle
    if (req.body.assignedVehicle) {
      await Vehicle.findByIdAndUpdate(req.body.assignedVehicle, { assignedDriver: driver._id });
    }

    await checkSafetyScoreAlert(driver);

    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private (Admin, Fleet Manager)
exports.updateDriver = async (req, res, next) => {
  try {
    let driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }

    // If license file uploaded
    if (req.file) {
      req.body.licenseUrl = req.file.url;
    }

    const oldVehicleId = driver.assignedVehicle;
    const newVehicleId = req.body.assignedVehicle;

    driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Handle Vehicle assignment changes
    if (newVehicleId !== undefined && String(oldVehicleId) !== String(newVehicleId)) {
      // Free old vehicle
      if (oldVehicleId) {
        await Vehicle.findByIdAndUpdate(oldVehicleId, { assignedDriver: null });
      }
      // Assign new vehicle
      if (newVehicleId) {
        await Vehicle.findByIdAndUpdate(newVehicleId, { assignedDriver: driver._id });
      }
    }

    await checkSafetyScoreAlert(driver);

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private (Admin)
exports.deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }

    // Free assigned vehicle
    if (driver.assignedVehicle) {
      await Vehicle.findByIdAndUpdate(driver.assignedVehicle, { assignedDriver: null });
    }

    await Driver.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    next(error);
  }
};
