// Notification controllers: list user notifications, mark as read
const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(userId);
    res.json({ notifications });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: 'Could not load notifications.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid notification ID.' });
    }

    const updatedNotification = await notificationService.markAsRead(id, userId);
    
    if (!updatedNotification) {
      // If it doesn't exist or belongs to another user
      return res.status(404).json({ error: 'Notification not found.' });
    }

    res.json({ message: 'Notification marked as read.', notification: updatedNotification });
  } catch (err) {
    console.error('Mark notification read error:', err);
    res.status(500).json({ error: 'Could not update notification.' });
  }
};

// Expose create for internal usage or admin routes if needed, though usually called internally
exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;
    
    if (!userId || !type || !message) {
      return res.status(400).json({ error: 'User ID, type, and message are required.' });
    }

    const notification = await notificationService.createNotification(userId, type, message);
    res.status(201).json({ message: 'Notification created.', notification });
  } catch (err) {
    console.error('Create notification error:', err);
    res.status(500).json({ error: 'Could not create notification.' });
  }
};
