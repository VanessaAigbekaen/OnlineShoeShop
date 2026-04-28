import { reviewsDataAccess } from '../data-access/reviews-data-access.js';
import { productsDataAccess } from '../data-access/products-data-access.js';
import { insertProductReviewSchema, deleteProductReviewSchema } from '../db/validation.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const reviewsService = {

  /** Get all reviews for a product */
  async getReviewsForProduct(productId) {
    const product = await productsDataAccess.findById(productId);
    if (!product) throw new NotFoundError('Product not found');

    return await reviewsDataAccess.findByProductId(productId);
  },

  /** Get the current user's review for a product */
  async getUserReviewForProduct(userId, productId) {
    if (!userId) return null;

    return await reviewsDataAccess.findByUserAndProduct(userId, productId);
  },

  /** Create or update a review (one per user per product) */
  async addOrUpdateReview(reviewData) {

    // Validate full object (your pattern)
    const validated = insertProductReviewSchema.parse(reviewData);

    // Ensure product exists
    const product = await productsDataAccess.findById(validated.productId);
    if (!product) throw new NotFoundError('Product not found');

    // Check if user already has a review
    const existing = await reviewsDataAccess.findByUserAndProduct(
      validated.userId,
      validated.productId
    );

    if (existing) {
      // Update existing review
      return await reviewsDataAccess.update(existing.id, {
        rating: validated.rating,
        comment: validated.comment
      });
    }

    // Create new review
    return await reviewsDataAccess.create(validated);
  },

  /** Delete a user's own review */
  async deleteOwnReview(userId, reviewId) {

    if (!userId) {
      throw new ValidationError('You must be logged in');
    }

    const validated = deleteProductReviewSchema.parse({ id: reviewId });

    const review = await reviewsDataAccess.findById(validated.id);
    if (!review) throw new NotFoundError('Review not found');

    // Ensure user owns the review
    if (review.userId !== userId) {
      throw new ValidationError('You can only delete your own review');
    }

    const deleted = await reviewsDataAccess.delete(validated.id);
    if (!deleted) throw new NotFoundError('Review not found to delete');

    return deleted;
  }
};