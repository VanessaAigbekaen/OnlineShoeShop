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
  let order = null;
  for (let i = 0; i < 10; i++) {
    const orders = await ordersService.getOrdersByUserId(userId);

    if (orders.length > 0) {
      order = orders[orders.length - 1];
      break;
    }
    await new Promise(res => setTimeout(res, 700));
  }

  if (!order) {
    throw error(404, 'Order not found after payment');
  }

  // 7️ Security check
  if (order.userId !== userId) {
    throw error(403, 'Access denied');
  }

  return { order };
}
