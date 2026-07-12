const mongoose = require('mongoose');

global.useMemoryDB = false;
global.memoryDB = {
  users: [],
  vehicles: [],
  drivers: [],
  trips: [],
  maintenance: [],
  fuelLogs: [],
  expenses: [],
  documents: [],
  notifications: [],
  reports: []
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/transitops', {
      serverSelectionTimeoutMS: 2000 // 2 seconds timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('--------------------------------------------------');
    console.log('WARNING: MongoDB is not running on port 27017.');
    console.log('TransitOps is entering in-memory database fallback mode.');
    console.log('All operations will run in RAM. Changes will reset on restart.');
    console.log('--------------------------------------------------');
    global.useMemoryDB = true;
    // Load initial seeds into memoryDB
    require('../seed/memorySeed')();
  }
};

module.exports = connectDB;
