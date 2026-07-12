const Trip = require('../models/Trip');
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Get all trips
// @route   GET /api/trips
// @access  Private
exports.getTrips = async (req, res, next) => {
  try {
    const { search, status, sortBy, page = 1, limit = 10 } = req.query;

    const query = {};

    // Search filter (source, destination, tripId)
    if (search) {
      query.$or = [
        { tripId: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sortBy) {
      const parts = sortBy.split(':');
      sortObj[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const total = await Trip.countDocuments(query);
    const trips = await Trip.find(query)
      .populate('vehicle')
      .populate('driver')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: trips.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('vehicle').populate('driver');
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new trip
// @route   POST /api/trips
// @access  Private (Admin, Fleet Manager)
exports.createTrip = async (req, res, next) => {
  try {
    const { vehicle: vehicleId, driver: driverId, source, destination, distance, cargoWeight, estDuration } = req.body;

    // Verify driver is available
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Assigned Driver not found' });
    }
    if (driver.availability !== 'Available') {
      return res.status(400).json({ success: false, error: `Driver is currently ${driver.availability}` });
    }

    // Verify vehicle is active
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: 'Assigned Vehicle not found' });
    }
    if (vehicle.status !== 'Active') {
      return res.status(400).json({ success: false, error: `Vehicle is currently ${vehicle.status}` });
    }

    // Generate unique Trip ID
    const count = await Trip.countDocuments();
    const tripId = `TRIP-${1000 + count + 1}`;

    const trip = await Trip.create({
      tripId,
      vehicle: vehicleId,
      driver: driverId,
      source,
      destination,
      distance,
      cargoWeight,
      estDuration,
      status: 'Scheduled',
    });

    // Mark driver availability (driver stays scheduled, triggers to On Trip later)
    await createNotification({
      title: 'New Trip Scheduled',
      message: `Trip ${tripId} has been scheduled for vehicle ${vehicle.regNumber} and driver ${driver.name}.`,
      type: 'Info',
    });

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private (Admin, Fleet Manager, Driver)
exports.updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    const prevStatus = trip.status;
    const nextStatus = req.body.status;

    // Apply specific status transition actions
    if (nextStatus && prevStatus !== nextStatus) {
      if (nextStatus === 'On Trip') {
        req.body.startDate = new Date();
        // Update driver availability
        await Driver.findByIdAndUpdate(trip.driver, { availability: 'On Trip' });
        await createNotification({
          title: 'Trip Started',
          message: `Trip ${trip.tripId} is now live and on route.`,
          type: 'Info',
        });
      } else if (nextStatus === 'Completed') {
        req.body.endDate = new Date();
        // Free driver
        await Driver.findByIdAndUpdate(trip.driver, { availability: 'Available' });
        // Update vehicle odometer
        const vehicle = await Vehicle.findById(trip.vehicle);
        if (vehicle) {
          vehicle.odometer += trip.distance;
          await vehicle.save();
        }
        await createNotification({
          title: 'Trip Completed',
          message: `Trip ${trip.tripId} completed successfully. Distance ${trip.distance}km added to vehicle odo.`,
          type: 'Info',
        });
      } else if (nextStatus === 'Cancelled') {
        // Free driver
        await Driver.findByIdAndUpdate(trip.driver, { availability: 'Available' });
        await createNotification({
          title: 'Trip Cancelled',
          message: `Trip ${trip.tripId} was cancelled.`,
          type: 'Alert',
        });
      }
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('vehicle').populate('driver');

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private (Admin)
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, error: 'Trip not found' });
    }

    // Release driver availability if deleted trip was active
    if (trip.status === 'On Trip') {
      await Driver.findByIdAndUpdate(trip.driver, { availability: 'Available' });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};
