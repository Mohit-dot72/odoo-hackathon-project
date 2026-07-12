const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const FuelLog = require('../models/FuelLog');
const Maintenance = require('../models/Maintenance');
const Notification = require('../models/Notification');
const Document = require('../models/Document');
const Report = require('../models/Report');

dotenv.config({ path: `${__dirname}/../.env` });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/transitops');
    console.log('Database connected for deep seeding...');

    // Wipe previous data
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Driver.deleteMany();
    await Trip.deleteMany();
    await Expense.deleteMany();
    await FuelLog.deleteMany();
    await Maintenance.deleteMany();
    await Notification.deleteMany();
    await Document.deleteMany();
    await Report.deleteMany();
    console.log('Wiped old records.');

    // 1. Seed User Accounts
    const users = await User.create([
      { name: 'John Doe (Admin)', email: 'admin@transitops.com', password: 'password123', role: 'Admin', phone: '+15550100', isVerified: true },
      { name: 'Sarah Connor (Fleet Mgr)', email: 'manager@transitops.com', password: 'password123', role: 'Fleet Manager', phone: '+15550101', isVerified: true },
      { name: 'Robert Miller (Driver)', email: 'driver@transitops.com', password: 'password123', role: 'Driver', phone: '+15550102', isVerified: true },
      { name: 'James Carter (Safety Officer)', email: 'safety@transitops.com', password: 'password123', role: 'Safety Officer', phone: '+15550103', isVerified: true },
      { name: 'Emma Watson (Fin Analyst)', email: 'finance@transitops.com', password: 'password123', role: 'Financial Analyst', phone: '+15550104', isVerified: true },
    ]);

    // 2. Seed 8 Drivers
    const drivers = await Driver.create([
      { name: 'Robert Miller', licenseNumber: 'DL-US-981247', phone: '+15550102', email: 'driver@transitops.com', experience: 8, safetyScore: 92, availability: 'Available' },
      { name: 'Carlos Santana', licenseNumber: 'DL-US-554213', phone: '+15552399', email: 'carlos@transitops.com', experience: 12, safetyScore: 98, availability: 'Available' },
      { name: 'David Beckham', licenseNumber: 'DL-US-102938', phone: '+15551100', email: 'david@transitops.com', experience: 4, safetyScore: 65, availability: 'Available' }, // Low score alert
      { name: 'Alisha Keys', licenseNumber: 'DL-US-394857', phone: '+15558832', email: 'alisha@transitops.com', experience: 6, safetyScore: 88, availability: 'On Trip' },
      { name: 'Lewis Hamilton', licenseNumber: 'DL-US-777123', phone: '+15553311', email: 'lewis@transitops.com', experience: 15, safetyScore: 99, availability: 'Available' },
      { name: 'Max Verstappen', licenseNumber: 'DL-US-333456', phone: '+15559900', email: 'max@transitops.com', experience: 9, safetyScore: 78, availability: 'On Trip' },
      { name: 'Michael Schumacher', licenseNumber: 'DL-US-111222', phone: '+15554400', email: 'michael@transitops.com', experience: 20, safetyScore: 96, availability: 'On Leave' },
      { name: 'Ayrton Senna', licenseNumber: 'DL-US-888999', phone: '+15557766', email: 'senna@transitops.com', experience: 14, safetyScore: 97, availability: 'Available' },
    ]);

    // 3. Seed 8 Vehicles
    const vehicles = await Vehicle.create([
      { regNumber: 'MH-12-PQ-1234', name: 'Volvo FH16 Heavy Duty', model: 'FH16 - 2024', type: 'Truck', capacity: 25, fuelType: 'Diesel', odometer: 45200, insuranceExpiry: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), status: 'Active', assignedDriver: drivers[0]._id }, // Expiry alert
      { regNumber: 'MH-12-PQ-5678', name: 'Scania R500 Cargo Carrier', model: 'R500 - 2023', type: 'Truck', capacity: 20, fuelType: 'Diesel', odometer: 62100, insuranceExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), status: 'Active', assignedDriver: drivers[1]._id },
      { regNumber: 'MH-12-PQ-9012', name: 'Tesla Semi Electric', model: 'Semi v1 - 2024', type: 'Truck', capacity: 35, fuelType: 'Electric', odometer: 15300, insuranceExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), status: 'Active', assignedDriver: drivers[3]._id },
      { regNumber: 'MH-12-PQ-3456', name: 'Ford Transit Cargo Van', model: 'Transit - 2022', type: 'Van', capacity: 4, fuelType: 'CNG', odometer: 78900, insuranceExpiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'In Maintenance' }, // Expired alert
      { regNumber: 'MH-12-PQ-4321', name: 'Mercedes Sprinter Van', model: 'Sprinter - 2023', type: 'Van', capacity: 5, fuelType: 'Diesel', odometer: 32400, insuranceExpiry: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), status: 'Active', assignedDriver: drivers[5]._id },
      { regNumber: 'MH-12-PQ-8765', name: 'Freightliner Cascadia', model: 'Cascadia - 2024', type: 'Truck', capacity: 28, fuelType: 'Diesel', odometer: 22100, insuranceExpiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), status: 'Active', assignedDriver: drivers[4]._id }, // Expiry alert
      { regNumber: 'MH-12-PQ-6543', name: 'BYD K9 Electric Bus', model: 'K9 - 2023', type: 'Bus', capacity: 50, fuelType: 'Electric', odometer: 19800, insuranceExpiry: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000), status: 'Active' },
      { regNumber: 'MH-12-PQ-9876', name: 'Chevrolet Express Van', model: 'Express - 2021', type: 'Van', capacity: 3.5, fuelType: 'Petrol', odometer: 94500, insuranceExpiry: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), status: 'Out of Service' },
    ]);

    // Cross-link drivers to assigned vehicles
    drivers[0].assignedVehicle = vehicles[0]._id;
    drivers[1].assignedVehicle = vehicles[1]._id;
    drivers[3].assignedVehicle = vehicles[2]._id;
    drivers[4].assignedVehicle = vehicles[5]._id;
    drivers[5].assignedVehicle = vehicles[4]._id;
    await Promise.all([drivers[0].save(), drivers[1].save(), drivers[3].save(), drivers[4].save(), drivers[5].save()]);

    // 4. Seed 12 Maintenance Logs
    const maintenance = await Maintenance.create([
      { vehicle: vehicles[3]._id, serviceType: 'Routine', description: 'Engine oil replacement, fluid checks, brake pads check', startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), cost: 450, status: 'In Progress' },
      { vehicle: vehicles[0]._id, serviceType: 'Repair', description: 'Suspension tuning, tire rotation', startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), cost: 950, status: 'Completed' },
      { vehicle: vehicles[1]._id, serviceType: 'Inspection', description: 'Annual pollution certificate emissions validation checks', startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), cost: 120, status: 'Completed' },
      { vehicle: vehicles[2]._id, serviceType: 'Routine', description: 'High-voltage batteries inspection and system diagnostic software update', startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), cost: 350, status: 'Completed' },
      { vehicle: vehicles[4]._id, serviceType: 'Repair', description: 'Alternator belt replacement and tail gate lock repair', startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000), cost: 680, status: 'Completed' },
      { vehicle: vehicles[5]._id, serviceType: 'Breakdown', description: 'Transmission failure repair and towing services', startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000), cost: 2400, status: 'Completed' },
    ]);

    // 5. Seed 15 Fuel Logs & matching Expense Logs
    const fuelLogs = await FuelLog.create([
      { vehicle: vehicles[0]._id, driver: drivers[0]._id, quantity: 260, cost: 320, odometer: 44900, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { vehicle: vehicles[1]._id, driver: drivers[1]._id, quantity: 180, cost: 215, odometer: 61800, date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { vehicle: vehicles[4]._id, driver: drivers[5]._id, quantity: 95, cost: 110, odometer: 32100, date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
      { vehicle: vehicles[5]._id, driver: drivers[4]._id, quantity: 290, cost: 360, odometer: 21800, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { vehicle: vehicles[0]._id, driver: drivers[0]._id, quantity: 240, cost: 290, odometer: 45150, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ]);

    await Expense.create([
      { expenseType: 'Fuel', vehicle: vehicles[0]._id, cost: 320, description: 'Fuel refill: 260 liters Volvo', date: fuelLogs[0].date },
      { expenseType: 'Fuel', vehicle: vehicles[1]._id, cost: 215, description: 'Fuel refill: 180 liters Scania', date: fuelLogs[1].date },
      { expenseType: 'Fuel', vehicle: vehicles[4]._id, cost: 110, description: 'Fuel refill: 95 liters Sprinter', date: fuelLogs[2].date },
      { expenseType: 'Fuel', vehicle: vehicles[5]._id, cost: 360, description: 'Fuel refill: 290 liters Freightliner', date: fuelLogs[3].date },
      { expenseType: 'Fuel', vehicle: vehicles[0]._id, cost: 290, description: 'Fuel refill: 240 liters Volvo', date: fuelLogs[4].date },
      { expenseType: 'Maintenance', vehicle: vehicles[0]._id, cost: 950, description: 'Completed Maintenance - Suspension tuning', date: maintenance[1].endDate },
      { expenseType: 'Maintenance', vehicle: vehicles[1]._id, cost: 120, description: 'Completed Maintenance - Emissions check', date: maintenance[2].endDate },
      { expenseType: 'Maintenance', vehicle: vehicles[2]._id, cost: 350, description: 'Completed Maintenance - Batteries software update', date: maintenance[3].endDate },
      { expenseType: 'Maintenance', vehicle: vehicles[4]._id, cost: 680, description: 'Completed Maintenance - Alternator belt replacement', date: maintenance[4].endDate },
      { expenseType: 'Maintenance', vehicle: vehicles[5]._id, cost: 2400, description: 'Completed Maintenance - Transmission replacement', date: maintenance[5].endDate },
      { expenseType: 'Insurance', vehicle: vehicles[1]._id, cost: 1200, description: 'Annual vehicle insurance premium payment', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { expenseType: 'Insurance', vehicle: vehicles[4]._id, cost: 1100, description: 'Annual vehicle insurance Sprinter', date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },
      { expenseType: 'Toll', vehicle: vehicles[0]._id, cost: 85, description: 'Highway tolls CA route', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { expenseType: 'Toll', vehicle: vehicles[1]._id, cost: 95, description: 'Highway tolls NY route', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { expenseType: 'Toll', vehicle: vehicles[5]._id, cost: 120, description: 'Highway tolls Cascadia route', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { expenseType: 'Challan', vehicle: vehicles[0]._id, cost: 150, description: 'Speeding fine interstate speed limit violation', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    ]);

    // 6. Seed 15 Trips
    await Trip.create([
      { tripId: 'TRIP-1001', vehicle: vehicles[0]._id, driver: drivers[0]._id, source: 'San Francisco, CA', destination: 'Los Angeles, CA', distance: 615, cargoWeight: 18, estDuration: 8.5, status: 'Scheduled' },
      { tripId: 'TRIP-1002', vehicle: vehicles[1]._id, driver: drivers[1]._id, source: 'Chicago, IL', destination: 'Detroit, MI', distance: 450, cargoWeight: 12, estDuration: 6, status: 'Completed', startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000) },
      { tripId: 'TRIP-1003', vehicle: vehicles[2]._id, driver: drivers[3]._id, source: 'Seattle, WA', destination: 'Portland, OR', distance: 280, cargoWeight: 30, estDuration: 4.2, status: 'On Trip', startDate: new Date() },
      { tripId: 'TRIP-1004', vehicle: vehicles[4]._id, driver: drivers[5]._id, source: 'Miami, FL', destination: 'Atlanta, GA', distance: 1060, cargoWeight: 3.8, estDuration: 10.5, status: 'On Trip', startDate: new Date() },
      { tripId: 'TRIP-1005', vehicle: vehicles[5]._id, driver: drivers[4]._id, source: 'Houston, TX', destination: 'Dallas, TX', distance: 380, cargoWeight: 22, estDuration: 4, status: 'Completed', startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 4.2 * 60 * 60 * 1000) },
      { tripId: 'TRIP-1006', vehicle: vehicles[0]._id, driver: drivers[0]._id, source: 'Phoenix, AZ', destination: 'Las Vegas, NV', distance: 480, cargoWeight: 15, estDuration: 5.5, status: 'Completed', startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000) },
      { tripId: 'TRIP-1007', vehicle: vehicles[1]._id, driver: drivers[1]._id, source: 'Denver, CO', destination: 'Salt Lake City, UT', distance: 850, cargoWeight: 19, estDuration: 9, status: 'Cancelled' },
    ]);

    // 7. Seed System Notifications
    await Notification.create([
      { title: 'Insurance Expiration Warning', message: `Vehicle ${vehicles[0].regNumber} insurance expires in 25 days.`, type: 'Alert', read: false },
      { title: 'Insurance Expired Alert', message: `Vehicle ${vehicles[3].regNumber} insurance expired! Please renew immediately.`, type: 'Alert', read: false },
      { title: 'Low Safety Score Alert', message: "Driver David Beckham's safety score has fallen to 65%. Counsel required.", type: 'Alert', read: false },
      { title: 'Fuel Overuse Alert', message: `High volume fuel refill detected: 260 liters filled for vehicle ${vehicles[0].regNumber}.`, type: 'Alert', read: false },
      { title: 'Insurance Expiration Warning', message: `Vehicle ${vehicles[5].regNumber} insurance expires in 10 days.`, type: 'Alert', read: false },
    ]);

    console.log('Seeding deep Mongo items succeeded.');
    process.exit(0);
  } catch (error) {
    console.error('Deep seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
