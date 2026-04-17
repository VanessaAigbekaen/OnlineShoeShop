import { db } from '$lib/server/db';
import { product, productCategory } from '$lib/server/db/schema';
import { productsService } from '$lib/server/services/products-service.js';
import { redirect, error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import fs from 'fs';
import path from 'path';
import { cartService } from '$lib/server/services/cart-service';


// Make sure uploads folder exists
const uploadsDir = path.resolve('static/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

export async function load({ locals }) {
    const products = await db.select().from(product);
    const categories = await db.select().from(productCategory);

    let user = null;
    if (locals.user) {
        const { usersService } = await import('$lib/server/services/users-service.js');
        user = await usersService.getById(Number(locals.user.id));
    }
    console.log('Products', products);
    console.log('Categories', categories);
    console.log('LOGGED IN USER:', locals.user);

    return {
        products,
        categories,
        user
    };
}

export const actions = {
  addToCart: async ({ locals, request }) => {
    if (!locals.user) {
      throw redirect(303, '/auth/login');
    }

    const data = await request.formData();
    const productId = Number(data.get('productId'));

    if (!productId) throw error(400, 'Invalid product');

    await cartService.addItem(locals.user.id, productId, 1);

    return { success: true };
  },

  createProduct: async ({ request }) => {
    try {
      const formData = await request.formData();

      const file = formData.get('prodImage');
      let filename = '';
      if (file && file.size > 0) {
        filename = `${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      }

      const productData = {
        name: formData.get('prodName'),
        description: formData.get('prodDesc'),
        price: Number(formData.get('prodPrice')),
        image: filename,
        quantity: Number(formData.get('prodQty')),
        categoryId: Number(formData.get('prodCatId'))
      };

      await productsService.createProduct(productData);
      return { success: true };

    } catch (err) {
      console.error('Error creating product:', err);
      return fail(500, { errors: { general: 'Failed to create product' } });
    }
  },

  updateProduct: async ({ request }) => {
    try {
      const formData = await request.formData();
      const id = Number(formData.get('prodId'));

      const existingProduct = await productsService.getProductById(id);
      if (!existingProduct) return fail(404);

      let filename = existingProduct.image;
      const file = formData.get('prodImage');
      if (file && file.size > 0) {
        filename = `${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      }

      const productData = {
        name: formData.get('prodName'),
        description: formData.get('prodDesc'),
        price: Number(formData.get('prodPrice')),
        image: filename,
        quantity: Number(formData.get('prodQty')),
        categoryId: Number(formData.get('prodCatId'))
      };

      await productsService.updateProduct(id, productData);
      return { success: true };

    } catch (err) {
      console.error('Error updating product:', err);
      return fail(500);
    }
  },

  deleteProduct: async ({ request }) => {
    try {
      const formData = await request.formData();
      const id = Number(formData.get('prodId'));

      await productsService.deleteProduct(id);
      return { success: true };

    } catch (err) {
      console.error('Error deleting product:', err);
      return fail(500);
    }
  }
};