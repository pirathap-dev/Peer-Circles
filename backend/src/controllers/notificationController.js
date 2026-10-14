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
    const id = Number(req.params.id);
    
    if (!Number.isInteger(id) || id <= 0) {
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
