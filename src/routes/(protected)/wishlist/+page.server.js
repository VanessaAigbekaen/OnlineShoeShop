import { wishlistService } from '$lib/server/services/wishlist-service.js';
import { error } from '@sveltejs/kit'
import { cartService } from "$lib/server/services/cart-service.js";

export async function load({ locals }) {
  if (!locals.user) throw error(401, 'Not authenticated');

  const items = await wishlistService.getItems(locals.user.id);

  return { items };
}

export const actions = {
    addItem: async ({ locals, request }) => {
        if (!locals.user) throw error(401);

        const data = await request.formData();
        const productId = Number(data.get('productId'));

        if(!Number.isInteger(productId) || productId < 1){
            throw error(400, 'Invalid product');
        }

        await wishlistService.addItem(locals.user.id, productId);
    },
    
    removeItem: async ({ locals, request }) => {
        if (!locals.user) throw error(401);

        const data = await request.formData();
        const productId = Number(data.get('productId'));

        await wishlistService.removeItem(locals.user.id, productId);
    },

    moveToCart: async ({ locals, request }) => {
        if (!locals.user) throw error(401);

        const data = await request.formData();
        const productId = Number(data.get('productId'));

        await wishlistService.removeItem(locals.user.id, productId);

        const cart = await cartService.getOrCreateCart(locals.user.id);
        await cartService.addItem(cart.id, productId, 1);
    }
};