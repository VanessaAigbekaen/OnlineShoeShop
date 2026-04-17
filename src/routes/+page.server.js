import { db } from '$lib/server/db';
import {product} from '$lib/server/db/schema';
import { cartService } from '$lib/server/services/cart-service';
import { redirect, error } from '@sveltejs/kit';


export async function load() {
    //Get location of products
  const products = await db.query.product.findMany();
    
  //Debbugging purposes
  console.log('Products', products);

  //Return data 
  return {
    products
  };
<<<<<<< HEAD
}

export const actions = {
  addToCart: async ({ locals, request }) => {
    console.log("🔥 ADD TO CART TRIGGERED");
    if (!locals.user) {
      throw redirect(303, '/auth/login');
    }

    const data = await request.formData();
    const productId = Number(data.get('productId'));

    if (!productId) {
      throw error(400, 'Invalid product');
    }

    await cartService.addItem(locals.user.id, productId, 1);

    return { success: true };
  }
};
=======

  
}
>>>>>>> leon
