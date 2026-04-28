import { db } from '../db/index.js';
import { productReview, user } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export const reviewsDataAccess = {

  /** Find a review by ID */
  async findById(id) {
    const result = await db
      .select()
      .from(productReview)
      .where(eq(productReview.id, id))
      .limit(1);

    return result[0] ?? null;
  },

  /** Get all reviews for a product (with user name) */
  async findByProductId(productId) {
    return await db
      .select({
        id: productReview.id,
        productId: productReview.productId,
        userId: productReview.userId,
        rating: productReview.rating,
        comment: productReview.comment,
        createdAt: productReview.createdAt,
        userName: user.name
      })
      .from(productReview)
      .innerJoin(user, eq(productReview.userId, user.id))
      .where(eq(productReview.productId, productId))
      .orderBy(desc(productReview.createdAt));
  },

  /** Find a specific user's review for a product */
  async findByUserAndProduct(userId, productId) {
    const result = await db
      .select()
      .from(productReview)
      .where(
        and(
          eq(productReview.userId, userId),
          eq(productReview.productId, productId)
        )
      )
      .limit(1);

    return result[0] ?? null;
  },

  /** Create a new review */
  async create(reviewData) {
    const result = await db
      .insert(productReview)
      .values(reviewData)
      .returning();

    return result[0];
  },

  /** Update an existing review */
  async update(id, reviewData) {
    const result = await db
      .update(productReview)
      .set(reviewData)
      .where(eq(productReview.id, id))
      .returning();

    return result[0];
  },

  /** Delete a review */
  async delete(id) {
    const result = await db
      .delete(productReview)
      .where(eq(productReview.id, id));

    return result.rowsAffected > 0;
  }
};