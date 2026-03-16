const { Notification } = require('../models');

class NotificationRepository {
  async findAllForUser(userId) {
    return await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
  }

  async markAllRead(userId) {
    return await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
  }

  async markReadById(userId, notificationId) {
    return await Notification.update({ isRead: true }, { where: { userId, id: notificationId } });
  }
}

module.exports = new NotificationRepository();
