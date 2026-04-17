import { productsService } from '$lib/server/services/products-service.js';
import { categoriesService } from '$lib/server/services/categories-service.js';
import { error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

// Load function
export async function load({ params }) {

    // get the product details for the product ID passed in
    const product = await productsService.getProductById(Number(params.id));

    // If the product is not found
    if (!product) throw error(404, 'Product not found');

    // We want to display the category name but only have the category ID
    // Make a call to the categories service with the ID to get the name
    const category = await categoriesService.getCategoryById(product.categoryId);
    const categoryName = category?.name ?? 'Unknown';

    return { product, categoryName };
}

export const actions = {
    createProduct: async ({ request }) => {
        try {
            const formData = await request.formData();

            const productData = {
                name: formData.get('name'),
                description: formData.get('Description'),
                price: Number(formData.get('price')),
                categoryId: Number(formData.get('CategoryId'))
            };

            await productsService.createProduct(productData);

            return { success: true};
        }
    }   catch (err) {
            console.error('Error updating product:', err);

            // Zod validation error → return user input errors (not a server error)
            if (err instanceof ZodError) {
                const errors = {};
                err.issues.forEach((error) => {
                    const field = error.path[0]?.toString();
                    if (field) {
                        errors[field] = error.message;
                    }
                });
                return fail(400, { errors });
            }

            return fail(500, {
                errors: { general: err.message || 'Failed to update product'}
            });
    }
}
    deleteProduct: async ({ request }) => {
		try {
			const formData = await request.formData();
            const id = Number(formData.get('catId'));
			
            // Call the products service passing in the ID
			await productsService.deleteCategory(id);

			return { success: true };

		} catch (err) {
            console.error('Error deleting Category:', err);
        }
}