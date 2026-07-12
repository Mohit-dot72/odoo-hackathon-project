const bcrypt = require('bcryptjs');

module.exports = () => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = (pwd) => bcrypt.hashSync(pwd, salt);

  // 1. Users
  global.memoryDB.users = [
    { _id: 'u1', name: 'John Doe (Admin)', email: 'admin@transitops.com', password: hashPassword('password123'), role: 'Admin', phone: '+15550100', isVerified: true, createdAt: new Date() },
    { _id: 'u2', name: 'Sarah Connor (Fleet Mgr)', email: 'manager@transitops.com', password: hashPassword('password123'), role: 'Fleet Manager', phone: '+15550101', isVerified: true, createdAt: new Date() },
    { _id: 'u3', name: 'Robert Miller (Driver)', email: 'driver@transitops.com', password: hashPassword('password123'), role: 'Driver', phone: '+15550102', isVerified: true, createdAt: new Date() },
    { _id: 'u4', name: 'James Carter (Safety Officer)', email: 'safety@transitops.com', password: hashPassword('password123'), role: 'Safety Officer', phone: '+15550103', isVerified: true, createdAt: new Date() },
    { _id: 'u5', name: 'Emma Watson (Fin Analyst)', email: 'finance@transitops.com', password: hashPassword('password123'), role: 'Financial Analyst', phone: '+15550104', isVerified: true, createdAt: new Date() },
  ];

  // 2. Drivers
  global.memoryDB.drivers = [
    { _id: 'd1', name: 'Robert Miller', licenseNumber: 'DL-US-981247', phone: '+15550102', email: 'driver@transitops.com', experience: 8, safetyScore: 92, availability: 'Available', licenseUrl: '', assignedVehicle: 'v1', createdAt: new Date() },
    { _id: 'd2', name: 'Carlos Santana', licenseNumber: 'DL-US-554213', phone: '+15552399', email: 'carlos@transitops.com', experience: 12, safetyScore: 98, availability: 'Available', licenseUrl: '', assignedVehicle: 'v2', createdAt: new Date() },
    { _id: 'd3', name: 'David Beckham', licenseNumber: 'DL-US-102938', phone: '+15551100', email: 'david@transitops.com', experience: 4, safetyScore: 65, availability: 'Available', licenseUrl: '', assignedVehicle: null, createdAt: new Date() },
    { _id: 'd4', name: 'Alisha Keys', licenseNumber: 'DL-US-394857', phone: '+15558832', email: 'alisha@transitops.com', experience: 6, safetyScore: 88, availability: 'On Trip', licenseUrl: '', assignedVehicle: 'v3', createdAt: new Date() },
    { _id: 'd5', name: 'Lewis Hamilton', licenseNumber: 'DL-US-777123', phone: '+15553311', email: 'lewis@transitops.com', experience: 15, safetyScore: 99, availability: 'Available', licenseUrl: '', assignedVehicle: 'v6', createdAt: new Date() },
    { _id: 'd6', name: 'Max Verstappen', licenseNumber: 'DL-US-333456', phone: '+15559900', email: 'max@transitops.com', experience: 9, safetyScore: 78, availability: 'On Trip', licenseUrl: '', assignedVehicle: 'v5', createdAt: new Date() },
    { _id: 'd7', name: 'Michael Schumacher', licenseNumber: 'DL-US-111222', phone: '+15554400', email: 'michael@transitops.com', experience: 20, safetyScore: 96, availability: 'On Leave', licenseUrl: '', assignedVehicle: null, createdAt: new Date() },
    { _id: 'd8', name: 'Ayrton Senna', licenseNumber: 'DL-US-888999', phone: '+15557766', email: 'senna@transitops.com', experience: 14, safetyScore: 97, availability: 'Available', licenseUrl: '', assignedVehicle: null, createdAt: new Date() },
  ];

  // 3. Vehicles
  global.memoryDB.vehicles = [
    { _id: 'v1', regNumber: 'MH-12-PQ-1234', name: 'Volvo FH16 Heavy Duty', model: 'FH16 - 2024', type: 'Truck', capacity: 25, fuelType: 'Diesel', odometer: 45200, insuranceExpiry: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), imageUrl: '', status: 'Active', assignedDriver: 'd1', createdAt: new Date() },
    { _id: 'v2', regNumber: 'MH-12-PQ-5678', name: 'Scania R500 Cargo Carrier', model: 'R500 - 2023', type: 'Truck', capacity: 20, fuelType: 'Diesel', odometer: 62100, insuranceExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), imageUrl: '', status: 'Active', assignedDriver: 'd2', createdAt: new Date() },
    { _id: 'v3', regNumber: 'MH-12-PQ-9012', name: 'Tesla Semi Electric', model: 'Semi v1 - 2024', type: 'Truck', capacity: 35, fuelType: 'Electric', odometer: 15300, insuranceExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), imageUrl: '', status: 'Active', assignedDriver: 'd4', createdAt: new Date() },
    { _id: 'v4', regNumber: 'MH-12-PQ-3456', name: 'Ford Transit Cargo Van', model: 'Transit - 2022', type: 'Van', capacity: 4, fuelType: 'CNG', odometer: 78900, insuranceExpiry: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), imageUrl: '', status: 'In Maintenance', assignedDriver: null, createdAt: new Date() },
    { _id: 'v5', regNumber: 'MH-12-PQ-4321', name: 'Mercedes Sprinter Van', model: 'Sprinter - 2023', type: 'Van', capacity: 5, fuelType: 'Diesel', odometer: 32400, insuranceExpiry: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), imageUrl: '', status: 'Active', assignedDriver: 'd6', createdAt: new Date() },
    { _id: 'v6', regNumber: 'MH-12-PQ-8765', name: 'Freightliner Cascadia', model: 'Cascadia - 2024', type: 'Truck', capacity: 28, fuelType: 'Diesel', odometer: 22100, insuranceExpiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), imageUrl: '', status: 'Active', assignedDriver: 'd5', createdAt: new Date() },
    { _id: 'v7', regNumber: 'MH-12-PQ-6543', name: 'BYD K9 Electric Bus', model: 'K9 - 2023', type: 'Bus', capacity: 50, fuelType: 'Electric', odometer: 19800, insuranceExpiry: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000), imageUrl: '', status: 'Active', assignedDriver: null, createdAt: new Date() },
    { _id: 'v8', regNumber: 'MH-12-PQ-9876', name: 'Chevrolet Express Van', model: 'Express - 2021', type: 'Van', capacity: 3.5, fuelType: 'Petrol', odometer: 94500, insuranceExpiry: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), imageUrl: '', status: 'Out of Service', assignedDriver: null, createdAt: new Date() },
  ];

  // 4. Trips
  global.memoryDB.trips = [
    { _id: 't1', tripId: 'TRIP-1001', vehicle: 'v1', driver: 'd1', source: 'San Francisco, CA', destination: 'Los Angeles, CA', distance: 615, cargoWeight: 18, estDuration: 8.5, status: 'Scheduled', startDate: null, endDate: null, createdAt: new Date() },
    { _id: 't2', tripId: 'TRIP-1002', vehicle: 'v2', driver: 'd2', source: 'Chicago, IL', destination: 'Detroit, MI', distance: 450, cargoWeight: 12, estDuration: 6, status: 'Completed', startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 't3', tripId: 'TRIP-1003', vehicle: 'v3', driver: 'd4', source: 'Seattle, WA', destination: 'Portland, OR', distance: 280, cargoWeight: 30, estDuration: 4.2, status: 'On Trip', startDate: new Date(), endDate: null, createdAt: new Date() },
    { _id: 't4', tripId: 'TRIP-1004', vehicle: 'v5', driver: 'd6', source: 'Miami, FL', destination: 'Atlanta, GA', distance: 1060, cargoWeight: 3.8, estDuration: 10.5, status: 'On Trip', startDate: new Date(), endDate: null, createdAt: new Date() },
    { _id: 't5', tripId: 'TRIP-1005', vehicle: 'v6', driver: 'd5', source: 'Houston, TX', destination: 'Dallas, TX', distance: 380, cargoWeight: 22, estDuration: 4, status: 'Completed', startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 4.2 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 't6', tripId: 'TRIP-1006', vehicle: 'v1', driver: 'd1', source: 'Phoenix, AZ', destination: 'Las Vegas, NV', distance: 480, cargoWeight: 15, estDuration: 5.5, status: 'Completed', startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 't7', tripId: 'TRIP-1007', vehicle: 'v2', driver: 'd2', source: 'Denver, CO', destination: 'Salt Lake City, UT', distance: 850, cargoWeight: 19, estDuration: 9, status: 'Cancelled', startDate: null, endDate: null, createdAt: new Date() },
  ];

  // 5. Maintenance
  global.memoryDB.maintenance = [
    { _id: 'm1', vehicle: 'v4', serviceType: 'Routine', description: 'Engine oil replacement, fluid checks, brake pads check', startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), cost: 450, status: 'In Progress', createdAt: new Date() },
    { _id: 'm2', vehicle: 'v1', serviceType: 'Repair', description: 'Suspension system tuning, front tire alignment', startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), cost: 950, status: 'Completed', createdAt: new Date() },
    { _id: 'm3', vehicle: 'v2', serviceType: 'Inspection', description: 'Annual pollution certificate emissions validation checks', startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), cost: 120, status: 'Completed', createdAt: new Date() },
    { _id: 'm4', vehicle: 'v3', serviceType: 'Routine', description: 'High-voltage batteries inspection and system diagnostic software update', startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), cost: 350, status: 'Completed', createdAt: new Date() },
    { _id: 'm5', vehicle: 'v5', serviceType: 'Repair', description: 'Alternator belt replacement and tail gate lock repair', startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000), cost: 680, status: 'Completed', createdAt: new Date() },
    { _id: 'm6', vehicle: 'v6', serviceType: 'Breakdown', description: 'Transmission failure repair and towing services', startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), endDate: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000), cost: 2400, status: 'Completed', createdAt: new Date() },
  ];

  // 6. Fuel Logs
  global.memoryDB.fuelLogs = [
    { _id: 'fl1', vehicle: 'v1', driver: 'd1', quantity: 260, cost: 320, odometer: 44900, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'fl2', vehicle: 'v2', driver: 'd2', quantity: 180, cost: 215, odometer: 61800, date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'fl3', vehicle: 'v5', driver: 'd6', quantity: 95, cost: 110, odometer: 32100, date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'fl4', vehicle: 'v6', driver: 'd5', quantity: 290, cost: 360, odometer: 21800, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'fl5', vehicle: 'v1', driver: 'd1', quantity: 240, cost: 290, odometer: 45150, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), createdAt: new Date() },
  ];

  // 7. Expenses
  global.memoryDB.expenses = [
    { _id: 'e1', expenseType: 'Fuel', vehicle: 'v1', cost: 320, description: 'Fuel refill: 260 liters Volvo', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e2', expenseType: 'Fuel', vehicle: 'v2', cost: 215, description: 'Fuel refill: 180 liters Scania', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e3', expenseType: 'Fuel', vehicle: 'v5', cost: 110, description: 'Fuel refill: 95 liters Sprinter', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e4', expenseType: 'Fuel', vehicle: 'v6', cost: 360, description: 'Fuel refill: 290 liters Freightliner', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e5', expenseType: 'Fuel', vehicle: 'v1', cost: 290, description: 'Fuel refill: 240 liters Volvo', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e6', expenseType: 'Maintenance', vehicle: 'v1', cost: 950, description: 'Completed Maintenance - Suspension tuning', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e7', expenseType: 'Maintenance', vehicle: 'v2', cost: 120, description: 'Completed Maintenance - Emissions check', date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e8', expenseType: 'Maintenance', vehicle: 'v3', cost: 350, description: 'Completed Maintenance - Batteries software update', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e9', expenseType: 'Maintenance', vehicle: 'v5', cost: 680, description: 'Completed Maintenance - Alternator belt replacement', date: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e10', expenseType: 'Maintenance', vehicle: 'v6', cost: 2400, description: 'Completed Maintenance - Transmission replacement', date: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e11', expenseType: 'Insurance', vehicle: 'v2', cost: 1200, description: 'Annual vehicle insurance premium payment', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e12', expenseType: 'Insurance', vehicle: 'v5', cost: 1100, description: 'Annual vehicle insurance Sprinter', date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e13', expenseType: 'Toll', vehicle: 'v1', cost: 85, description: 'Highway tolls CA route', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e14', expenseType: 'Toll', vehicle: 'v2', cost: 95, description: 'Highway tolls NY route', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e15', expenseType: 'Toll', vehicle: 'v6', cost: 120, description: 'Highway tolls Cascadia route', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), createdAt: new Date() },
    { _id: 'e16', expenseType: 'Challan', vehicle: 'v1', cost: 150, description: 'Speeding fine interstate speed limit violation', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), createdAt: new Date() },
  ];

  // 8. Notifications
  global.memoryDB.notifications = [
    { _id: 'n1', title: 'Insurance Expiration Warning', message: 'Vehicle MH-12-PQ-1234 insurance expires in 25 days.', type: 'Alert', read: false, createdAt: new Date() },
    { _id: 'n2', title: 'Insurance Expired Alert', message: 'Vehicle MH-12-PQ-3456 insurance expired! Please renew immediately.', type: 'Alert', read: false, createdAt: new Date() },
    { _id: 'n3', title: 'Low Safety Score Alert', message: "Driver David Beckham's safety score has fallen to 65%. Counsel required.", type: 'Alert', read: false, createdAt: new Date() },
    { _id: 'n4', title: 'Fuel Overuse Alert', message: 'High volume fuel refill detected: 260 liters filled for vehicle MH-12-PQ-1234.', type: 'Alert', read: false, createdAt: new Date() },
    { _id: 'n5', title: 'Insurance Expiration Warning', message: 'Vehicle MH-12-PQ-8765 insurance expires in 10 days.', type: 'Alert', read: false, createdAt: new Date() },
  ];

  // 9. Documents
  global.memoryDB.documents = [];

  // 10. Reports
  global.memoryDB.reports = [];

  console.log('Deep seeded in-memory database successfully.');
};
