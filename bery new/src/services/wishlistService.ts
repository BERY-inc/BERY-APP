import apiClient from './apiClient';
import { Item } from './itemService';

export interface WishlistItem {
  id: number;
  user_id: number;
  item_id: number;
  created_at: string;
  updated_at: string;
  item: Item;
}

class WishlistService {
  // Get wishlist items
  async getWishlist(): Promise<WishlistItem[]> {
    try {
      const response = await apiClient.get<{ products: WishlistItem[] }>('/api/v1/customer/wish-list/');
      return response.data.products;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  // Add item to wishlist
  async addToWishlist(itemId: number): Promise<any> {
    try {
      const response = await apiClient.post('/api/v1/customer/wish-list/add', { item_id: itemId });
      return response.data;
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      throw error;
    }
  }

  // Remove item from wishlist
  async removeFromWishlist(itemId: number): Promise<any> {
    try {
      const response = await apiClient.delete('/api/v1/customer/wish-list/remove', {
        data: { item_id: itemId }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      throw error;
    }
  }
}

export default new WishlistService();