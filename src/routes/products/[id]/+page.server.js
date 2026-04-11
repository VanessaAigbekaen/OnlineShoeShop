import { productsService } from '$lib/server/services/products-service.js';
import { categoriesService } from '$lib/server/services/categories-service.js';
import { error } from '@sveltejs/kit';

// Load function
export async function load({ params }) {

    // get the product details for the product ID passed in
    const product = await productsService.getProductById(Number(params.id));

    // If the product is not found
    if (!product) throw error(404, 'Product not found');

    // We want to display the category name but only have the category ID
    // Make a call to the categories service with the ID to get the name
    const category = await categoriesService.getCategoryById(product.categoryId);
    const categoryName = category.name;

    return { product, categoryName };
}