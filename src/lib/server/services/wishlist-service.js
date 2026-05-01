import { wishlistDataAccess } from '../data-access/wishlist-data-access.js';

export const wishlistService = {
  async getItems (userId) {
    return wishlistDataAccess.getItems(userId);
  },

  async addItem (userId, productId) {
    const existing = await wishlistDataAccess.getItems(userId);
    const alreadyAdded = existing.find(item => item.productId === productId);

    if(alreadyAdded) return alreadyAdded;

    return wishlistDataAccess.addItem(userId, productId);
  },

  async removeItem(userId, productId) {
      return wishlistDataAccess.removeItem(userId, productId);
    },

  async updateNote(userId, productId, note){
    return wishlistDataAccess.updateNote(userId, productId, note);
  }
}
