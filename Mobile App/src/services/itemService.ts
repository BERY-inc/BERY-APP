import apiClient from './apiClient';

export interface Item {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  discount_type: string;
  available_time_starts: string;
  available_time_ends: string;
  veg: number;
  status: number;
  store_id: number;
  category_id: number;
  rating_count: number;
  avg_rating: number;
  created_at: string;
  updated_at: string;
}

export interface ItemDetails extends Item {
  images: string[];
  choice_options: any[];
  variations: any[];
  add_ons: any[];
  tags: string[];
  organic: number;
  stock: number;
}

export interface CartItem {
  item_id: number;
  item: Item;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  variant: string;
  variation: any[];
  add_ons: any[];
  add_on_qtys: number[];
  add_on_prices: number[];
}

export interface AddToCartRequest {
  item_id: number;
  quantity: number;
  variant?: string;
  variation?: any[];
  add_ons?: number[];
  add_on_qtys?: number[];
}

class ItemService {
  // Get latest products with graceful fallbacks
  async getLatestProducts(options?: { store_id?: number; category_id?: number; limit?: number; offset?: number }): Promise<Item[]> {
    try {
      // Determine store_id: prefer provided, else localStorage (selectedStoreId or storeId), else fetch latest stores
      let storeId = options?.store_id;
      if (!storeId) {
        const storedSelected = localStorage.getItem('selectedStoreId');
        const storedId = localStorage.getItem('storeId');
        if (storedSelected && !isNaN(Number(storedSelected))) {
          storeId = Number(storedSelected);
        } else if (storedId && !isNaN(Number(storedId))) {
          storeId = Number(storedId);
        }
      }

      if (!storeId || Number.isNaN(storeId)) {
        const storeRes = await apiClient.get<{ stores: any[] }>('/api/v1/stores/latest');
        const storesArr = storeRes.data?.stores ?? [];
        const firstStore = Array.isArray(storesArr) && storesArr.length > 0 ? storesArr[0] : null;
        if (firstStore && firstStore.id) {
          storeId = Number(firstStore.id);
          try { localStorage.setItem('storeId', String(storeId)); } catch {}
        }
      }

      const params: any = {
        store_id: storeId,
        limit: options?.limit ?? 20,
        offset: options?.offset ?? 0,
      };
      
      // The API requires category_id for /items/latest endpoint.
      // If category_id is provided, use /items/latest.
      // If NOT provided, use /items/popular which works with just store_id.
      if (options?.category_id && options.category_id > 0) {
        params.category_id = options.category_id;
        const response = await apiClient.get<{ products: Item[] }>('/api/v1/items/latest', { params });
        const products = response.data.products;
        return Array.isArray(products) ? products : [];
      } else {
        // Fallback to popular items for the store if no category is selected
        // This avoids the "category_id field is required" error
        const response = await apiClient.get<{ products: Item[] }>('/api/v1/items/popular', { params });
        const products = response.data.products;
        return Array.isArray(products) ? products : [];
      }
    } catch (error: any) {
      // Fallback to popular or recommended if latest fails (e.g., 500)
      try {
        const fallbackPopular = await apiClient.get<{ products: Item[] }>('/api/v1/items/popular');
        return fallbackPopular.data.products ?? [];
      } catch (popErr) {
        try {
          const fallbackRecommended = await apiClient.get<{ products: Item[] }>('/api/v1/items/recommended');
          return fallbackRecommended.data.products ?? [];
        } catch (recErr) {
          throw error;
        }
      }
    }
  }

  // Get popular products
  async getPopularProducts(): Promise<Item[]> {
    try {
      const response = await apiClient.get<{ products: Item[] }>('/api/v1/items/popular');
      return response.data.products;
    } catch (error) {
      throw error;
    }
  }

  // Get product details
  async getProductDetails(itemId: number): Promise<ItemDetails> {
    try {
      const response = await apiClient.get<ItemDetails>(`/api/v1/items/details/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Search products
  async searchProducts(query: string): Promise<Item[]> {
    try {
      const response = await apiClient.get<{ products: Item[] }>(`/api/v1/items/search?name=${query}`);
      return response.data.products;
    } catch (error) {
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId: number): Promise<Item[]> {
    try {
      const response = await apiClient.get<{ products: Item[] }>(`/api/v1/categories/items/${categoryId}`);
      return response.data.products;
    } catch (error) {
      throw error;
    }
  }

  // Get cart items
  async getCartItems(): Promise<CartItem[]> {
    try {
      const response = await apiClient.get<{ cart_items: CartItem[] }>('/api/v1/cart/list');
      return response.data.cart_items;
    } catch (error) {
      throw error;
    }
  }

  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<any> {
    try {
      const response = await apiClient.post('/api/v1/cart/add', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update cart item
  async updateCart(data: { key: string; quantity: number }): Promise<any> {
    try {
      const response = await apiClient.post('/api/v1/cart/update', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Remove cart item
  async removeCartItem(key: string): Promise<any> {
    try {
      const response = await apiClient.delete('/api/v1/cart/remove-item', {
        data: { key }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Clear cart
  async clearCart(): Promise<any> {
    try {
      const response = await apiClient.delete('/api/v1/cart/remove');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ItemService();
