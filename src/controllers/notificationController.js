const notificationService = require('../services/notificationService');
const apiResponse = require('../utils/apiResponse');

class NotificationController {
  // GET /api/notifications
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await notificationService.getNotifications(userId);
      return apiResponse.success(res, 'Notifications retrieved successfully', notifications);
    } catch (error) {
      return apiResponse.error(res, error.message);
    }
  }

  // PUT /api/notifications/read (mark all read)
  async markAllRead(req, res) {
    try {
      const userId = req.user.id;
      const result = await notificationService.markAllRead(userId);
      return apiResponse.success(res, result.message);
    } catch (error) {
      return apiResponse.error(res, error.message);
    }
  }

  // PUT /api/notifications/:id/read (mark one read)
  async markReadById(req, res) {
    try {
      const userId = req.user.id;
      const notificationId = parseInt(req.params.id);
      const result = await notificationService.markReadById(userId, notificationId);
      return apiResponse.success(res, result.message);
    } catch (error) {
      return apiResponse.error(res, error.message);
    }
  }
}

module.exports = new NotificationController();
