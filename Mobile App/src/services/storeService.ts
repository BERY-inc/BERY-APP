import apiClient from './apiClient';

export interface Store {
  id: number;
  name: string;
  phone: string;
  email: string;
  logo: string;
  latitude: string;
  longitude: string;
  address: string;
  minimum_order: number;
  comission: number;
  schedule_order: boolean;
  status: number;
  vendor_id: number;
  created_at: string;
  updated_at: string;
  free_delivery: boolean;
  cover_photo: string;
  delivery: boolean;
  take_away: boolean;
  item_section: boolean;
  tax: number;
  zone_id: number;
  reviews_section: boolean;
  active: boolean;
  off_day: string;
  gst: string;
  self_delivery_system: number;
  pos_system: boolean;
  minimum_shipping_charge: number;
  delivery_time: string;
  veg: number;
  non_veg: number;
  order_count: number;
  total_order: number;
  module_id: number;
  order_place_to_schedule_interval: number;
  featured: number;
  per_km_shipping_charge: number;
  prescription_order: boolean;
  slug: string;
  maximum_shipping_charge: number;
  cutlery: boolean;
  meta_title: string;
  meta_description: string;
  meta_image: string;
  announcement: number;
  announcement_message: string;
  rating_count: number;
  avg_rating: number;
  rating: string;
}

const storeService = {
  // Include pagination params and robust parsing for different response shapes
  getStores: async (filter: string = 'all', options?: { limit?: number; offset?: number }): Promise<Store[]> => {
    try {
      const params: any = {
        limit: options?.limit ?? 20,
        offset: options?.offset ?? 0,
      };
      const response = await apiClient.get(`/api/v1/stores/get-stores/${filter}`, { params });
      const data = response.data as any;
      const stores: Store[] = Array.isArray(data) ? data : (data?.stores ?? []);
      return stores;
    } catch (error) {
      console.error('Error fetching stores:', error);
      // Fallback to latest stores
      try {
        const latestRes = await apiClient.get<{ stores: Store[] }>("/api/v1/stores/latest");
        return latestRes.data?.stores ?? [];
      } catch (fallbackErr) {
        console.error('Fallback latest stores failed:', fallbackErr);
        throw error;
      }
    }
  },

  getLatestStores: async (options?: { limit?: number; offset?: number; moduleId?: number }): Promise<Store[]> => {
    try {
      const params: any = {
        limit: options?.limit ?? 20,
        offset: options?.offset ?? 0,
        ...(options?.moduleId && { module_id: options.moduleId }),
      };
      const response = await apiClient.get<{ stores: Store[] }>("/api/v1/stores/latest", { params });
      return response.data?.stores ?? [];
    } catch (error) {
      console.error('Error fetching latest stores:', error);
      throw error;
    }
  },

  getPopularStores: async (type: string = 'all', options?: { moduleId?: number }): Promise<Store[]> => {
    try {
      const params: any = {
        type,
        ...(options?.moduleId && { module_id: options.moduleId }),
      };
      const response = await apiClient.get<{ stores: Store[] }>('\/api\/v1\/stores\/popular', { params });
      return response.data?.stores ?? [];
    } catch (error) {
      console.error('Error fetching popular stores:', error);
      throw error;
    }
  },

  getRecommendedStores: async (): Promise<Store[]> => {
    try {
      const response = await apiClient.get<{ stores: Store[] }>('\/api\/v1\/stores\/recommended');
      return response.data?.stores ?? [];
    } catch (error) {
      console.error('Error fetching recommended stores:', error);
      throw error;
    }
  }
};

export default storeService;