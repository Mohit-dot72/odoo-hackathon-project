const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null implies a global notification for all users
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['Alert', 'Info', 'Reminder'],
      default: 'Info',
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    read: {
      type: Boolean,
      default: false, // Used for direct target notifications
    },
  },
  {
    timestamps: true,
  }
);

const mongooseModel = mongoose.model('Notification', NotificationSchema);
const MockModel = require('../utils/mockModel');
const notificationMock = new MockModel('notifications');

module.exports = new Proxy(mongooseModel, {
  get(target, prop, receiver) {
    if (global.useMemoryDB) {
      return notificationMock[prop];
    }
    return Reflect.get(target, prop, receiver);
  }
});

