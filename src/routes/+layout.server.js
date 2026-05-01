import { usersService } from '$lib/server/services/users-service.js';
import { cartService } from '$lib/server/services/cart-service';
import { wishlistService } from '$lib/server/services/wishlist-service.js';

export async function load({ locals }) {
  if (!locals.user) {
    return {
      user: null,
      cartCount: 0,
      wishlistCount: 0
    };
  }

  // Get user details
  const fullUser = await usersService.getById(Number(locals.user.id));
  
  // Cart items
  const cart = await cartService.getOrCreateCart(locals.user.id);
  const items = await cartService.getItems(cart.id);

  // Wishlist items
  const wishlistItems = await wishlistService.getItems(locals.user.id);


  return {
    user: fullUser,
    cartCount: items.length,
    wishlistCount: wishlistItems.length
  };
  
}
