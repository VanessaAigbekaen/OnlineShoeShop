import { error } from '@sveltejs/kit';
import { ordersDataAccess } from '$lib/server/data-access/orders-data-access';

export async function load({ params, locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const orderId = Number(params.id);
  const userId = Number(locals.user.id);

  if (!Number.isInteger(orderId) || orderId < 1) {
    throw error(400, 'Invalid order');
  }

  const order = await ordersDataAccess.findById(orderId);
  console.log("ORDER:", order);
  console.log("USER ID:", userId);
  console.log("PARAM ID:", params.id);

  if (!order) {
    throw error(404, 'Order not found');
  }

  if (Number(order.userId) !== userId) {
    throw error(403, 'Access denied');
  }
  
  const items = await ordersDataAccess.findDetailsWithProductsByOrderId(orderId);
  return { order,items };
}
