import { isSupabaseConfigured, supabase } from './supabaseClient';

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

function getOrCreateGuestId(): string {
  let guestId = localStorage.getItem('guest_id');
  if (!guestId) {
    guestId = generateGuestId();
    localStorage.setItem('guest_id', guestId);
  }
  return guestId;
}

// Ensure we have a moduleId for cart operations
async function ensureModuleId(): Promise<void> {
  let moduleId = localStorage.getItem('moduleId');
  if (!moduleId) {
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
      const { data, error } = await supabase.from('modules').select('id').order('id', { ascending: true }).limit(1);
      if (error) throw new Error(error.message);
      const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
      moduleId = first?.id ? String(first.id) : '1';
      localStorage.setItem('moduleId', moduleId);
    } catch (error) {
      if (isDev) {
        console.error('Failed to resolve moduleId, using fallback:', error);
      }
      moduleId = '1';
      localStorage.setItem('moduleId', moduleId);
    }
  }
}

async function getAuthOwner(): Promise<{ userId: string | null; guestId: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { userId: null, guestId: getOrCreateGuestId() };
  const { data, error } = await supabase.auth.getUser();
  if (error) return { userId: null, guestId: getOrCreateGuestId() };
  const userId = data.user?.id ?? null;
  if (userId) return { userId, guestId: null };
  return { userId: null, guestId: getOrCreateGuestId() };
}

class ItemService {
  // Get latest products with graceful fallbacks
  async getLatestProducts(options?: { store_id?: number; category_id?: number; limit?: number; offset?: number }): Promise<Item[]> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');

    const numericLimit = Math.max(1, Math.min(100, Number(options?.limit) || 20));
    const numericOffset = Math.max(0, Number(options?.offset) || 0);
    const from = numericOffset;
    const to = numericOffset + numericLimit - 1;

    let storeId = options?.store_id;
    if (!storeId) {
      const storedSelected = localStorage.getItem('selectedStoreId');
      const storedId = localStorage.getItem('storeId');
      if (storedSelected && !Number.isNaN(Number(storedSelected))) {
        storeId = Number(storedSelected);
      } else if (storedId && !Number.isNaN(Number(storedId))) {
        storeId = Number(storedId);
      }
    }

    let q = supabase.from('items').select('*');
    if (storeId && Number.isFinite(Number(storeId))) q = q.eq('store_id', Number(storeId));
    if (options?.category_id && Number(options.category_id) > 0) q = q.eq('category_id', Number(options.category_id));

    const { data, error } = await q.order('created_at', { ascending: false }).range(from, to);
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  }

  // Get popular products
  async getPopularProducts(): Promise<Item[]> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.from('items').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  }

  // Get product details
  async getProductDetails(itemId: number): Promise<ItemDetails> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.from('items').select('*').eq('id', itemId).maybeSingle();
    if (error) throw new Error(error.message);
    const base: any = data || {};

    let images: string[] = [];
    try {
      const imgRes = await supabase.from('item_images').select('url').eq('item_id', itemId).order('id', { ascending: true });
      if (!imgRes.error) {
        images = (imgRes.data ?? []).map((r: any) => String(r?.url || '').trim()).filter(Boolean);
      }
    } catch {}

    return {
      ...base,
      images: Array.isArray(base.images) ? base.images : images,
      choice_options: Array.isArray(base.choice_options) ? base.choice_options : [],
      variations: Array.isArray(base.variations) ? base.variations : [],
      add_ons: Array.isArray(base.add_ons) ? base.add_ons : [],
      tags: Array.isArray(base.tags) ? base.tags : [],
      organic: Number.isFinite(Number(base.organic)) ? Number(base.organic) : 0,
      stock: Number.isFinite(Number(base.stock)) ? Number(base.stock) : 0,
    } as ItemDetails;
  }

  // Search products
  async searchProducts(query: string): Promise<Item[]> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const q = String(query || '').trim();
    if (!q) return [];
    const { data, error } = await supabase.from('items').select('*').ilike('name', `%${q}%`).order('created_at', { ascending: false }).limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  }

  // Get products by category
  async getProductsByCategory(categoryId: number): Promise<Item[]> {
    return this.getLatestProducts({ category_id: categoryId });
  }

  async getCartItems(): Promise<CartItem[]> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    await ensureModuleId();
    const { userId, guestId } = await getAuthOwner();

    let q = supabase
      .from('cart_items')
      .select('id, item_id, quantity, price, discount, tax, variant, variation, add_ons, add_on_qtys, add_on_prices, item:items(*)')
      .order('id', { ascending: true });

    if (userId) q = q.eq('user_id', userId);
    if (guestId) q = q.eq('guest_id', guestId);

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  }

  async addToCart(data: AddToCartRequest): Promise<any> {
    await ensureModuleId();

    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { userId, guestId } = await getAuthOwner();

    const payload: any = {
      user_id: userId,
      guest_id: guestId,
      item_id: Number(data.item_id),
      quantity: Math.max(1, Number(data.quantity) || 1),
      price: Number(data.price) || 0,
      variant: data.variant ?? '',
      variation: data.variation ?? [],
      add_ons: data.add_ons ?? [],
      add_on_qtys: data.add_on_qtys ?? [],
    };

    let existingId: any = null;
    try {
      let existingQ = supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('item_id', payload.item_id)
        .eq('variant', payload.variant)
        .limit(1);
      if (userId) existingQ = existingQ.eq('user_id', userId);
      if (guestId) existingQ = existingQ.eq('guest_id', guestId);
      const existing = await existingQ.maybeSingle();
      if (!existing.error && existing.data) {
        existingId = existing.data.id;
        const nextQty = Math.max(1, Number(existing.data.quantity || 0) + payload.quantity);
        const upd = await supabase.from('cart_items').update({ quantity: nextQty, price: payload.price }).eq('id', existingId);
        if (upd.error) throw new Error(upd.error.message);
        return { updated: true, id: existingId };
      }
    } catch (e) {
      if (isDev) console.error('Cart upsert check failed:', e);
    }

    const ins = await supabase.from('cart_items').insert([payload]).select('id').maybeSingle();
    if (ins.error) throw new Error(ins.error.message);
    return { created: true, id: ins.data?.id ?? null, existingId };
  }

  async updateCart(data: { cart_id: number; quantity: number; price: number; guest_id?: string }): Promise<any> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    await ensureModuleId();
    const { userId, guestId } = await getAuthOwner();

    let q = supabase
      .from('cart_items')
      .update({
        quantity: Math.max(1, Number(data.quantity) || 1),
        price: Number(data.price) || 0,
      })
      .eq('id', data.cart_id);

    if (userId) q = q.eq('user_id', userId);
    if (guestId) q = q.eq('guest_id', guestId);

    const { error } = await q;
    if (error) throw new Error(error.message);
    return { updated: true };
  }

  async removeCartItem(cart_id: number): Promise<any> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    await ensureModuleId();
    const { userId, guestId } = await getAuthOwner();

    let q = supabase.from('cart_items').delete().eq('id', cart_id);
    if (userId) q = q.eq('user_id', userId);
    if (guestId) q = q.eq('guest_id', guestId);

    const { error } = await q;
    if (error) throw new Error(error.message);
    return { deleted: true };
  }

  // Clear cart
  async clearCart(): Promise<any> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { userId, guestId } = await getAuthOwner();

    let q = supabase.from('cart_items').delete();
    if (userId) q = q.eq('user_id', userId);
    if (guestId) q = q.eq('guest_id', guestId);

    const { error } = await q;
    if (error) throw new Error(error.message);
    return { cleared: true };
  }
}

export default new ItemService();
