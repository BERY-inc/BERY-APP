import { isSupabaseConfigured, supabase } from './supabaseClient';
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
    if (!isSupabaseConfigured || !supabase) return [];
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return [];

    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id, user_id, item_id, created_at, updated_at, item:items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  }

  // Add item to wishlist
  async addToWishlist(itemId: number): Promise<any> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const userId = userData.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const payload: any = {
      user_id: userId,
      item_id: Number(itemId),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('wishlist_items')
      .upsert(payload, { onConflict: 'user_id,item_id' })
      .select('id')
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { added: true, id: (data as any)?.id ?? null };
  }

  // Remove item from wishlist
  async removeFromWishlist(itemId: number): Promise<any> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const userId = userData.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', Number(itemId));
    if (error) throw new Error(error.message);
    return { removed: true };
  }
}

export default new WishlistService();
