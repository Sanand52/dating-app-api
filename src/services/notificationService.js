const notificationRepository = require('../repositories/notificationRepository');

class NotificationService {
  async getNotifications(userId) {
    return await notificationRepository.findAllForUser(userId);
  }

  async markAllRead(userId) {
    await notificationRepository.markAllRead(userId);
    return { message: 'All notifications marked as read' };
  }

  async markReadById(userId, notificationId) {
    await notificationRepository.markReadById(userId, notificationId);
    return { message: 'Notification marked as read' };
  }
}

module.exports = new NotificationService();
