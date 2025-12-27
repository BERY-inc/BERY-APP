import { isSupabaseConfigured, supabase } from './supabaseClient';

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
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');

    const numericLimit = Math.max(1, Math.min(100, Number(options?.limit) || 20));
    const numericOffset = Math.max(0, Number(options?.offset) || 0);
    const from = numericOffset;
    const to = numericOffset + numericLimit - 1;

    let q = supabase.from('stores').select('*');
    if (filter && filter !== 'all') {
      q = q.eq('filter', filter);
    }

    const { data, error } = await q.order('created_at', { ascending: false }).range(from, to);
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  },

  getLatestStores: async (options?: { limit?: number; offset?: number; moduleId?: number }): Promise<Store[]> => {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');

    const numericLimit = Math.max(1, Math.min(100, Number(options?.limit) || 20));
    const numericOffset = Math.max(0, Number(options?.offset) || 0);
    const from = numericOffset;
    const to = numericOffset + numericLimit - 1;

    let q = supabase.from('stores').select('*');
    if (options?.moduleId && Number.isFinite(Number(options.moduleId))) {
      q = q.eq('module_id', Number(options.moduleId));
    }

    const { data, error } = await q.order('created_at', { ascending: false }).range(from, to);
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  },

  getPopularStores: async (type: string = 'all', options?: { moduleId?: number }): Promise<Store[]> => {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    let q = supabase.from('stores').select('*');
    if (options?.moduleId && Number.isFinite(Number(options.moduleId))) {
      q = q.eq('module_id', Number(options.moduleId));
    }
    if (type && type !== 'all') {
      q = q.eq('type', type);
    }
    const { data, error } = await q.order('created_at', { ascending: false }).limit(20);
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  },

  getRecommendedStores: async (): Promise<Store[]> => {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.from('stores').select('*').eq('recommended', true).order('created_at', { ascending: false }).limit(20);
    if (error) {
      const fallback = await supabase.from('stores').select('*').order('created_at', { ascending: false }).limit(20);
      if (fallback.error) throw new Error(fallback.error.message);
      return (fallback.data ?? []) as any;
    }
    return (data ?? []) as any;
  }
};

export default storeService;
