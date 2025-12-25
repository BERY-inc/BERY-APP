import apiClient from './apiClient';

const isDev = !!(import.meta as any).env?.DEV;

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
  module_id: number;
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
  id?: number; // Cart ID
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
  price: number;
  variant?: string;
  variation?: any[];
  add_ons?: number[];
  add_on_qtys?: number[];
  model?: string;
  guest_id?: string;
}

// Helper to generate numeric Guest ID (compatible with backend BIGINT user_id)
function generateGuestId(): string {
  // Use timestamp + random 3 digits to ensure uniqueness and fit in BIGINT
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${Date.now()}${random}`;
}

// Get proper guest ID from backend
async function getGuestIdFromBackend(): Promise<string> {
  try {
    const response = await apiClient.post('/api/v1/auth/guest/request', {
      fcm_token: 'guest_' + Date.now() // Simple FCM token for guest
    });
    return response.data.guest_id;
  } catch (error) {
    if (isDev) {
      console.error('Failed to get guest ID from backend, using fallback:', error);
    }
    // Fallback to local generation if backend fails
    return generateGuestId();
  }
}

// Ensure we have a moduleId for cart operations
async function ensureModuleId(): Promise<void> {
  let moduleId = localStorage.getItem('moduleId');
  if (!moduleId) {
    // Try to get default module from backend
    try {
      const response = await apiClient.get('/api/v1/module');
      if (response.data?.data && response.data.data.length > 0) {
        moduleId = response.data.data[0].id.toString();
        localStorage.setItem('moduleId', moduleId);
      } else {
        moduleId = '1';
        localStorage.setItem('moduleId', moduleId);
      }
    } catch (error) {
      if (isDev) {
        console.error('Failed to get module from backend, using fallback:', error);
      }
      // Use a common default module ID
      moduleId = '1';
      localStorage.setItem('moduleId', moduleId);
    }
  }
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

  async getCartItems(): Promise<CartItem[]> {
    try {
      await ensureModuleId();
      
      const token = localStorage.getItem('authToken');
      const currentModuleId = localStorage.getItem('moduleId');
      
      const headers: any = {
        'moduleId': currentModuleId,
        'zoneId': localStorage.getItem('zoneId')
      };
      
      const params: any = {};
      
      if (!token) {
        let guestId = localStorage.getItem('guest_id');
        if (!guestId) {
          guestId = await getGuestIdFromBackend();
          localStorage.setItem('guest_id', guestId);
        }
        params.guest_id = guestId;
      } else {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await apiClient.get<any>('/api/v1/customer/cart/list', {
        params: params,
        headers: headers
      });
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.cart_items)) return data.cart_items;
      return [];
    } catch (error) {
      throw error;
    }
  }

  async addToCart(data: AddToCartRequest): Promise<any> {
    await ensureModuleId();
    
    const token = localStorage.getItem('authToken');
    const payload = { ...data };

    if (!payload.model) {
      payload.model = 'Item';
    }

    try {
            if (!token) {
              let guestId = localStorage.getItem('guest_id');
              if (!guestId) {
                guestId = await getGuestIdFromBackend();
                localStorage.setItem('guest_id', guestId);
              }
              payload.guest_id = guestId;
            }

      const response = await apiClient.post('/api/v1/customer/cart/add', payload);
      return response.data;
    } catch (error) {
      const errorMessage = (error instanceof Error ? error.message : String(error ?? '')).toLowerCase();
      const isItemAlreadyExists =
        errorMessage.includes('item already exists') ||
        errorMessage.includes('already exists') ||
        errorMessage.includes('already in cart');

      if (isItemAlreadyExists) {
        return { alreadyExists: true, message: error instanceof Error ? error.message : 'Item already exists' };
      }

      if (isDev) {
        console.error('Error adding item to cart:', error);
      }

      throw error;
    }
  }

  async updateCart(data: { cart_id: number; quantity: number; price: number; guest_id?: string }): Promise<any> {
    try {
      await ensureModuleId();
      
      const token = localStorage.getItem('authToken');
      const payload = { ...data };

      if (!token) {
         let guestId = localStorage.getItem('guest_id');
         if (!guestId) {
           guestId = await getGuestIdFromBackend();
           localStorage.setItem('guest_id', guestId);
         }
         payload.guest_id = guestId;
      }

      const response = await apiClient.post<any>('/api/v1/customer/cart/update', payload);
      const responseData = response.data;
      if (Array.isArray(responseData)) return responseData;
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  async removeCartItem(cart_id: number): Promise<any> {
    try {
      await ensureModuleId();
      
      const token = localStorage.getItem('authToken');
      const payload: any = { cart_id };

      if (!token) {
        const guestId = localStorage.getItem('guest_id');
        if (guestId) {
          payload.guest_id = guestId;
        }
      }

      const response = await apiClient.delete<any>('/api/v1/customer/cart/remove-item', {
        data: payload
      });
      const data = response.data;
      if (Array.isArray(data)) return data;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Clear cart
  async clearCart(): Promise<any> {
    try {
      const response = await apiClient.delete<any>('/api/v1/customer/cart/remove');
      const data = response.data;
      if (Array.isArray(data)) return data;
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ItemService();
