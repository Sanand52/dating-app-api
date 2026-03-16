const subscriptionService = require('../services/subscriptionService');
const apiResponse = require('../utils/apiResponse');

class SubscriptionController {

  // GET /api/subscriptions/plans
  async getPlans(req, res) {
    try {
      const plans = await subscriptionService.getPlans();
      return apiResponse.success(res, 'Subscription plans retrieved successfully', plans);
    } catch (error) {
      return apiResponse.error(res, error.message);
    }
  }

  // POST /api/subscriptions/buy
  async buyPlan(req, res) {
    try {
      const userId = req.user.id;
      const { planId } = req.body;

      if (!planId) {
        return apiResponse.error(res, 'planId is required', 400);
      }

      const subscription = await subscriptionService.buyPlan(userId, parseInt(planId));
      return apiResponse.success(res, 'Subscription purchased successfully', subscription, 201);
    } catch (error) {
      return apiResponse.error(res, error.message, 400);
    }
  }

  // GET /api/subscriptions/status
  async getStatus(req, res) {
    try {
      const userId = req.user.id;
      const status = await subscriptionService.getStatus(userId);
      return apiResponse.success(res, 'Subscription status retrieved successfully', status);
    } catch (error) {
      return apiResponse.error(res, error.message);
    }
  }
}

module.exports = new SubscriptionController();
