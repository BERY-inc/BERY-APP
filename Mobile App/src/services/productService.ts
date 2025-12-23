import apiClient from './apiClient';

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
        try {
            // Determine store_id: prefer provided, else localStorage, else fetch latest stores
            let storeId = options?.store_id ?? (localStorage.getItem('storeId') ? Number(localStorage.getItem('storeId')) : undefined);
            if (!storeId || Number.isNaN(storeId)) {
                const storeRes = await apiClient.get<{ stores: any[] }>("/api/v1/stores/latest");
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
            // Only include category_id when > 0 to avoid backend mishandling
            if (options?.category_id && options.category_id > 0) {
                params.category_id = options.category_id;
            }

            const response = await apiClient.get<{ products: Product[] }>("/api/v1/items/latest", { params });
            const products = response.data.products;
            return Array.isArray(products) ? products : [];
        } catch (error: any) {
            // Fallback to popular or recommended if latest fails (e.g., 500)
            try {
                const fallbackPopular = await apiClient.get<{ products: Product[] }>("/api/v1/items/popular");
                return fallbackPopular.data.products ?? [];
            } catch (popErr) {
                try {
                    const fallbackRecommended = await apiClient.get<{ products: Product[] }>("/api/v1/items/recommended");
                    return fallbackRecommended.data.products ?? [];
                } catch (recErr) {
                    throw error;
                }
            }
        }
    },

    getPopularProducts: async (): Promise<Product[]> => {
        try {
            const response = await apiClient.get('/api/v1/items/popular');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getDiscountedProducts: async (): Promise<Product[]> => {
        try {
            const response = await apiClient.get('/api/v1/items/discounted');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getRecommendedProducts: async (): Promise<Product[]> => {
        try {
            const response = await apiClient.get('/api/v1/items/recommended');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
