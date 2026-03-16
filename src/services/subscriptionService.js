const subscriptionRepository = require('../repositories/subscriptionRepository');
const { User } = require('../models');

class SubscriptionService {

  // GET /subscriptions/plans
  async getPlans() {
    return await subscriptionRepository.findAllPlans();
  }

  // POST /subscriptions/buy
  async buyPlan(userId, planId) {
    const plan = await subscriptionRepository.findPlanById(planId);
    if (!plan) throw new Error('Subscription plan not found');
    if (!plan.isActive) throw new Error('This plan is no longer available');

    // Check if user already has an active subscription
    const existing = await subscriptionRepository.findActiveSubscription(userId);
    if (existing) throw new Error('You already have an active subscription. Cancel it first or wait for it to expire.');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await subscriptionRepository.createSubscription({
      userId,
      planId,
      startDate,
      endDate,
      status: 'active'
    });

    // Mark user as premium
    await User.update({ isPremium: true }, { where: { id: userId } });

    return subscription;
  }

  // GET /subscriptions/status
  async getStatus(userId) {
    const subscription = await subscriptionRepository.findActiveSubscription(userId);

    if (!subscription) {
      return { subscribed: false, plan: null, startDate: null, endDate: null, daysRemaining: 0 };
    }

    // Auto-expire if past end date
    if (new Date() > new Date(subscription.endDate)) {
      await subscriptionRepository.updateSubscriptionStatus(subscription.id, 'expired');
      await User.update({ isPremium: false }, { where: { id: userId } });
      return { subscribed: false, plan: null, startDate: null, endDate: null, daysRemaining: 0 };
    }

    const daysRemaining = Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24));

    return {
      subscribed: true,
      plan: subscription.Plan,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      daysRemaining
    };
  }
}

module.exports = new SubscriptionService();
