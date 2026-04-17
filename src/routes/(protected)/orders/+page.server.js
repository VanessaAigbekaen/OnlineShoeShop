import { ordersDataAccess } from '$lib/server/data-access/orders-data-access';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!locals.user) throw error(401, 'Not logged in');

  const orders = await ordersDataAccess.findByUserId(locals.user.id);

  return { orders };
}