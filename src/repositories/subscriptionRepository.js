const { SubscriptionPlan, Subscription, User } = require('../models');

class SubscriptionRepository {
  // ── Plan operations ─────────────────────────────────────
  async findAllPlans() {
    return await SubscriptionPlan.findAll({
      where: { isActive: true },
      order: [['price', 'ASC']]
    });
  }

  async findPlanById(id) {
    return await SubscriptionPlan.findByPk(id);
  }

  // ── Subscription operations ─────────────────────────────
  async createSubscription(data) {
    return await Subscription.create(data);
  }

  async findActiveSubscription(userId) {
    return await Subscription.findOne({
      where: { userId, status: 'active' },
      include: [{ model: SubscriptionPlan, as: 'Plan' }],
      order: [['endDate', 'DESC']]
    });
  }

  async findSubscriptionsByUser(userId) {
    return await Subscription.findAll({
      where: { userId },
      include: [{ model: SubscriptionPlan, as: 'Plan' }],
      order: [['createdAt', 'DESC']]
    });
  }

  async updateSubscriptionStatus(id, status) {
    const subscription = await Subscription.findByPk(id);
    if (!subscription) return null;
    return await subscription.update({ status });
  }
}

module.exports = new SubscriptionRepository();
