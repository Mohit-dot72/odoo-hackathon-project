const Notification = require('../models/Notification');
const { sendRealTimeNotification } = require('../services/socketService');

/**
 * Creates and logs a notification in DB, then triggers a real-time event.
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.message
 * @param {string} params.type - 'Alert' | 'Info' | 'Reminder'
 * @param {string} [params.recipient] - Optional user ID
 */
const createNotification = async ({ title, message, type = 'Info', recipient = null }) => {
  try {
    const notification = await Notification.create({
      title,
      message,
      type,
      recipient,
    });

    // Populate or format notification object for client
    const notificationData = {
      _id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: notification.read,
      createdAt: notification.createdAt,
      recipient,
    };

    // Dispatch via Socket.IO
    sendRealTimeNotification(recipient, notificationData);

    return notification;
  } catch (error) {
    console.error('Failed to create notification helper:', error.message);
  }
};

module.exports = { createNotification };
