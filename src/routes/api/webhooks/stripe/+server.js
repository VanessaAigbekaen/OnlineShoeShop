console.log("🔥 WEBHOOK RECEIVED");
import { stripe } from '$lib/server/stripe.js';
import { json } from '@sveltejs/kit';
import { ordersService } from '$lib/server/services/orders-service.js';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';

export const POST = async ({ request }) => {
  // 1️ Get Stripe signature header
  const sig = request.headers.get('stripe-signature');

  // 2️ Read raw body (required for Stripe verification)
  const rawBody = await request.text();
  console.log("🔥 WEBHOOK RECEIVED");
  let event;

  try {
    // 3️ Verify webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET
    );

    console.log("EVENT TYPE:", event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 4️ Handle relevant Stripe events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = Number(session.metadata?.userId);
    console.log("CREATING ORDER FOR USER:", userId);
     if (!userId) {
      console.warn('No userId in metadata');
      return json({ received: true });
    }

    try {
      const order = await ordersService.createOrderFromCart({ id: userId });
      console.log(" Order created:", order.id);
    } catch (err) {
      console.error(" Webhook error:", err);
    }
  }
  return json({ received: true });
};
