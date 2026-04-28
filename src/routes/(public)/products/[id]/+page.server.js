import { productsService } from '$lib/server/services/products-service.js';
import { reviewsService } from '$lib/server/services/reviews-service.js';
import { categoriesService } from '$lib/server/services/categories-service.js';
import { cartService } from '$lib/server/services/cart-Service';
import { redirect, error, fail } from '@sveltejs/kit';
import { ZodError } from 'zod';

// Load function
export async function load({ params, locals }) {

    // get the product details for the product ID passed in
    const productId = Number(params.id);
    const product = await productsService.getProductById(productId);

    // If the product is not found
    if (!product) throw error(404, 'Product not found');

    // We want to display the category name but only have the category ID
    // Make a call to the categories service with the ID to get the name
    const category = await categoriesService.getCategoryById(product.categoryId);
    const categoryName = category.name;

    // NEW: reviews
    const reviews = await reviewsService.getReviewsForProduct(productId);

    const userReview = locals.user
        ? await reviewsService.getUserReviewForProduct(locals.user.id, productId)
        : null;

    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    return {
        product,
        categoryName: category.name,
        reviews,
        userReview,
        reviewCount,
        averageRating
    };

    return { product, categoryName };
}

// Cart Action
export const actions = {
  addToCart: async ({ locals, request }) => {

    if (!locals.user) {
      throw redirect(303, '/auth/login');
    }

    const data = await request.formData();
    const productId = Number(data.get('productId'));
    const userId = Number(locals.user.id);

    if (!productId) throw error(400, 'Invalid product');

    await cartService.addItem(userId, productId, 1);

    return { success: true };
  },

  submitReview: async ({ locals, request }) => {
    try {
      if (!locals.user) {
        throw redirect(303, '/auth/login');
      }

      const formData = await request.formData();
      const userId = Number(locals.user.id);

      // Build full object
      const reviewData = {
        productId: Number(formData.get('productId')),
        userId: userId,
        rating: Number(formData.get('rating')),
        comment: formData.get('comment')?.toString().trim() || null
      };

      await reviewsService.addOrUpdateReview(reviewData);

      return { success: true };

    } catch (err) {
      console.error('Error submitting review:', err);

      if (err instanceof ZodError) {
        const errors = {};
        err.issues.forEach((e) => {
          const field = e.path[0]?.toString();
          if (field) errors[field] = e.message;
        });
        return fail(400, { errors });
      }

      return fail(500, {
        errors: { general: err.message || 'Failed to save review' }
      });
    }
  }, 

  deleteReview: async ({ request, locals }) => {
		try {
			if (!locals.user) {
				return fail(401, {
					errors: { general: 'You must be logged in to delete a review' }
				});
			}

			const formData = await request.formData();
			const reviewId = Number(formData.get('reviewId'));
      const userId = Number(locals.user.id);

			await reviewsService.deleteOwnReview(userId, reviewId);

			return { success: true };
		} catch (err) {
			console.error('Error deleting review:', err);

			if (err instanceof ZodError) {
				const errors = {};
				err.issues.forEach((issue) => {
					const field = issue.path[0]?.toString();
					if (field) errors[field] = issue.message;
				});
				return fail(400, { errors });
			}

			return fail(500, {
				errors: {
					general: err instanceof Error ? err.message : 'Failed to delete review'
				}
			});
		}
	}
};
