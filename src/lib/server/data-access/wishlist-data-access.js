import { db } from '$lib/server/db'
import { wishlistItem, product } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const wishlistDataAccess = {
    async getItems(userId) {
        return await db
        .select({
            id: wishlistItem.id,
            productId: product.id,
            image: product.image,
            name: product.name,
            unitPrice: product.price,
            categoryId: product.categoryId
      })
        .from(wishlistItem)
        .innerJoin(product, eq(wishlistItem.productId, product.id))
        .where(eq(wishlistItem.userId, userId));
  },

    async addItem(userId, productId) {
        const existing = await db
            .select()
            .from(wishlistItem)
            .where(and(eq(wishlistItem.userId, userId), eq(wishlistItem.productId, productId)))
            .limit(1);
        
        if(existing[0]) return existing[0];

        const inserted = await db
            .insert(wishlistItem)
            .values({ userId, productId })
            .returning();
  
        return inserted[0] ?? null;
    },

    async removeItem(userId, productId) {
    await db
        .delete(wishlistItem)
        .where(and(eq(wishlistItem.userId, userId), eq(wishlistItem.productId, productId)));
    },

    async isInWishlist(userId, productId) {
        const result = await db
            .select()
            .from(wishlistItem)
            .where(and(eq(wishlistItem.userId, userId), eq(wishlistItem.productId, productId)))
            .limit(1);

        return !!result[0];
    }
};
