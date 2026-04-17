import { error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe.js';
import { ordersService } from '$lib/server/services/orders-service.js';

export async function load({ url, locals }) {
  // 1️ Ensure user is logged in
  if (!locals.user) {
    throw error(401, 'Not authenticated');
  }

  // Normalize user ID (Better Auth may return it as a string)
  const userId = Number(locals.user.id);
  if (!Number.isInteger(userId)) {
    throw error(401, 'Invalid user');
  }

  // 2️ Get Stripe session ID from URL
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) {
    throw error(400, 'Missing session_id');
  }

  // 3️ Fetch Stripe Checkout Session
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // 4️ Ensure payment is complete
  if (session.payment_status !== 'paid') {
    throw error(400, 'Payment not completed');
  }

  /// 5️ Get latest order for this user (created by webhook)
  const orders = await ordersService.getOrdersByUserId(userId);

  if (!orders.length) {
    throw error(404, 'No orders found');
  }

  // Get most recent order
  const order = orders[orders.length - 1];

  // 7️ Security check
  if (order.userId !== userId) {
    throw error(403, 'Access denied');
  }

  return { order };
}
