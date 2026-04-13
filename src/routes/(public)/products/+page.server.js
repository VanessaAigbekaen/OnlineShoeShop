import { db } from '$lib/server/db';
import { product, productCategory } from '$lib/server/db/schema';
import { productsService } from '$lib/server/services/products-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';
import fs from 'fs';
import path from 'path';

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
    createProduct: async ({ request }) => {
        try {
            const formData = await request.formData();

            // Handle image upload
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
            if (err instanceof ZodError) {
                const errors = {};
                err.issues.forEach(e => {
                    const field = e.path[0]?.toString();
                    if (field) errors[field] = e.message;
                });
                return fail(400, { errors });
            }
            return fail(500, { errors: { general: 'Failed to create product' } });
        }
    },

    updateProduct: async ({ request }) => {
        try {
            const formData = await request.formData();
            const id = Number(formData.get('prodId'));

            // Keep existing image unless a new one is uploaded
            const existingProduct = await productsService.getProductById(id);
            if (!existingProduct) return fail(404, { errors: { general: 'Product not found' } });

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
            return fail(500, { errors: { general: 'Failed to update product' } });
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

            const message = (err?.cause?.message || err?.message || '').toString();
            const isForeignKey = message.includes('SQLITE_CONSTRAINT_FOREIGNKEY');
            if (isForeignKey) {
                return fail(409, {
                    errors: { general: 'Cannot delete this product because it is linked to orders.' }
                });
            }
            return fail(500, { errors: { general: 'Failed to delete product' } });
        }
    }
};