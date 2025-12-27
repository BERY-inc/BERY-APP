import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    category_id: number;
    category_ids: { id: string; position: number }[];
    variations: any[];
    add_ons: any[];
    attributes: any[];
    choice_options: any[];
    price: number;
    tax: number;
    tax_type: string;
    discount: number;
    discount_type: string;
    available_time_starts: string;
    available_time_ends: string;
    veg: number;
    status: number;
    store_id: number;
    created_at: string;
    updated_at: string;
    order_count: number;
    avg_rating: number;
    rating_count: number;
    rating: string;
    module_id: number;
    stock: number;
    unit_id: number;
    images: string[];
    food_variations: any[];
    slug: string;
    recommended: number;
    organic: number;
    store_name: string;
    store_discount: number;
    schedule_order: boolean;
    unit_type: string;
}

export const productService = {
    getLatestProducts: async (options?: { store_id?: number; category_id?: number; limit?: number; offset?: number }): Promise<Product[]> => {
        if (!isSupabaseConfigured || !supabase) return [];

        const numericLimit = Math.max(1, Math.min(100, Number(options?.limit) || 20));
        const numericOffset = Math.max(0, Number(options?.offset) || 0);
        const from = numericOffset;
        const to = numericOffset + numericLimit - 1;

        let storeId = options?.store_id;
        if (!storeId) {
            const stored = localStorage.getItem('storeId');
            if (stored && !Number.isNaN(Number(stored))) {
                storeId = Number(stored);
            } else {
                const storeRes = await supabase.from('stores').select('id').order('created_at', { ascending: false }).limit(1);
                if (!storeRes.error && Array.isArray(storeRes.data) && storeRes.data.length > 0) {
                    const first = storeRes.data[0] as any;
                    if (first?.id) {
                        storeId = Number(first.id);
                        try { localStorage.setItem('storeId', String(storeId)); } catch {}
                    }
                }
            }
        }

        let q = supabase.from('items').select('*');
        if (storeId && Number.isFinite(Number(storeId))) q = q.eq('store_id', Number(storeId));
        if (options?.category_id && Number(options.category_id) > 0) q = q.eq('category_id', Number(options.category_id));

        const res = await q.order('created_at', { ascending: false }).range(from, to);
        if (res.error) throw new Error(res.error.message);
        return (res.data ?? []) as any;
    },

    getPopularProducts: async (): Promise<Product[]> => {
        if (!isSupabaseConfigured || !supabase) return [];
        const res = await supabase.from('items').select('*').order('created_at', { ascending: false }).limit(20);
        if (res.error) throw new Error(res.error.message);
        return (res.data ?? []) as any;
    },

    getDiscountedProducts: async (): Promise<Product[]> => {
        if (!isSupabaseConfigured || !supabase) return [];
        const res = await supabase.from('items').select('*').gt('discount', 0).order('created_at', { ascending: false }).limit(20);
        if (res.error) throw new Error(res.error.message);
        return (res.data ?? []) as any;
    },

    getRecommendedProducts: async (): Promise<Product[]> => {
        if (!isSupabaseConfigured || !supabase) return [];
        const res = await supabase.from('items').select('*').eq('recommended', true).order('created_at', { ascending: false }).limit(20);
        if (res.error) {
            const fallback = await supabase.from('items').select('*').order('created_at', { ascending: false }).limit(20);
            if (fallback.error) throw new Error(fallback.error.message);
            return (fallback.data ?? []) as any;
        }
        return (res.data ?? []) as any;
    }
};
