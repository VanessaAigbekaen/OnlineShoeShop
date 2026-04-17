import { stripe } from '$lib/server/stripe.js';
import { json } from '@sveltejs/kit';
import { ordersService } from '$lib/server/services/orders-service.js';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { usersService } from '$lib/server/services/users-service.js';

export const POST = async ({ request }) => {
  // 1️ Get Stripe signature header
  const sig = request.headers.get('stripe-signature');

  // 2️ Read raw body (required for Stripe verification)
  const rawBody = await request.text();

  let event;

  try {
    // 3️ Verify webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 4️ Handle relevant Stripe events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const userId = Number(session.metadata?.userId);

    if (!userId) {
      console.warn('checkout.session.completed without userId metadata');
    } else {
      try {
        const user = await usersService.getById(userId);
        await ordersService.createOrderFromCart({ id: userId });

        console.log(`Order created for user ${userId}`);
      } catch (err) {
        console.error(`Failed to create order for user ${userId}:`, err);
      }
    }
  }

  // 6️ Acknowledge receipt to Stripe
  return json({ received: true });
};
