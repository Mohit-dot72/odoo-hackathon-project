let ioInstance = null;
const userSockets = new Map(); // maps userId -> socketId

const init = (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Join user-specific channel
    socket.on('register_user', (userId) => {
      if (userId) {
        userSockets.set(userId, socket.id);
        socket.join(userId);
        console.log(`User ${userId} registered socket channel.`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  ioInstance = io;
  return io;
};

const getIO = () => {
  return ioInstance;
};

// Send real-time alert to specific user or broadcast to all
const sendRealTimeNotification = (recipientId, notification) => {
  if (!ioInstance) return;

  if (recipientId) {
    // Send to specific user channel
    ioInstance.to(recipientId.toString()).emit('notification', notification);
    console.log(`Real-time notification sent to user ${recipientId}`);
  } else {
    // Broadcast globally
    ioInstance.emit('notification', notification);
    console.log('Real-time notification broadcasted globally');
  }
};

module.exports = {
  init,
  getIO,
  sendRealTimeNotification,
};
