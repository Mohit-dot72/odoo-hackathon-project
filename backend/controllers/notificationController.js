const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    // Return notifications targeted at this user OR global notifications (recipient = null)
    const notifications = await Notification.find({
      $or: [{ recipient: req.user._id }, { recipient: null }],
    }).sort({ createdAt: -1 });

    // Format notifications for client to indicate read state
    const formatted = notifications.map((n) => {
      const isRead = n.recipient ? n.read : n.readBy.includes(req.user._id);
      return {
        _id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        createdAt: n.createdAt,
        read: isRead,
      };
    });

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    if (notification.recipient) {
      notification.read = true;
    } else {
      if (!notification.readBy.includes(req.user._id)) {
        notification.readBy.push(req.user._id);
      }
    }

    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllRead = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [{ recipient: req.user._id }, { recipient: null }],
    });

    for (let n of notifications) {
      if (n.recipient) {
        n.read = true;
      } else {
        if (!n.readBy.includes(req.user._id)) {
          n.readBy.push(req.user._id);
        }
      }
      await n.save();
    }

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
