// Order service for 6amMart user app integration
import { Order, PaginatedOrder, OrderCancellationReason, RefundReason } from '../types/orderTypes';
import { isSupabaseConfigured, supabase } from './supabaseClient';

class OrderService {
  private generateGuestId(): string {
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${Date.now()}${random}`;
  }

  private getOrCreateGuestId(): string {
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
      guestId = this.generateGuestId();
      localStorage.setItem('guest_id', guestId);
    }
    return guestId;
  }

  private async getAuthOwner(): Promise<{ userId: string | null; guestId: string | null }> {
    if (!isSupabaseConfigured || !supabase) return { userId: null, guestId: this.getOrCreateGuestId() };
    const { data, error } = await supabase.auth.getUser();
    if (error) return { userId: null, guestId: this.getOrCreateGuestId() };
    const userId = data.user?.id ?? null;
    if (userId) return { userId, guestId: null };
    return { userId: null, guestId: this.getOrCreateGuestId() };
  }

  private async getOrdersPage(params: { offset: number; limit: number; mode: 'running' | 'history' }): Promise<PaginatedOrder> {
    const numericLimit = Math.max(1, Math.min(100, Number(params.limit) || 10));
    const numericOffset = Math.max(1, Number(params.offset) || 1);
    const from = (numericOffset - 1) * numericLimit;
    const to = from + numericLimit - 1;

    if (!isSupabaseConfigured || !supabase) {
      return { total_size: 0, limit: numericLimit, offset: numericOffset, orders: [] };
    }

    const { userId, guestId } = await this.getAuthOwner();

    let q = supabase.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    if (userId) q = q.eq('user_id', userId);
    if (guestId) q = q.eq('guest_id', guestId);

    const res = await q.range(from, to);
    if (res.error) throw new Error(res.error.message);

    const rows = Array.isArray(res.data) ? (res.data as any[]) : [];
    const orders = params.mode === 'running'
      ? rows.filter((r) => !['delivered', 'canceled', 'cancelled', 'refunded', 'failed'].includes(String(r?.order_status || '').toLowerCase()))
      : rows;

    return {
      total_size: Number(res.count) || orders.length,
      limit: numericLimit,
      offset: numericOffset,
      orders: orders as any,
    };
  }

  // Get running orders
  async getRunningOrders(offset: number = 1, limit: number = 10): Promise<PaginatedOrder> {
    return this.getOrdersPage({ offset, limit, mode: 'running' });
  }

  // Get order history
  async getOrderHistory(offset: number = 1, limit: number = 10): Promise<PaginatedOrder> {
    return this.getOrdersPage({ offset, limit, mode: 'history' });
  }

  // Get order details
  async getOrderDetails(orderId: string): Promise<Order[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { userId, guestId } = await this.getAuthOwner();
    let q = supabase.from('orders').select('*').eq('id', orderId).limit(1);
    if (userId) q = q.eq('user_id', userId);
    if (guestId) q = q.eq('guest_id', guestId);
    const res = await q;
    if (res.error) throw new Error(res.error.message);
    const row = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
    return row ? ([row] as any) : [];
  }

  // Track order
  async trackOrder(orderId: string): Promise<Order[]> {
    return this.getOrderDetails(orderId);
  }

  // Cancel order
  async cancelOrder(orderId: string, reason: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { userId, guestId } = await this.getAuthOwner();
    let q = supabase.from('orders').update({ order_status: 'canceled', cancel_reason: reason, updated_at: new Date().toISOString() }).eq('id', orderId);
    if (userId) q = q.eq('user_id', userId);
    if (guestId) q = q.eq('guest_id', guestId);
    const res = await q;
    if (res.error) throw new Error(res.error.message);
    return true;
  }

  // Get order cancellation reasons
  async getCancellationReasons(): Promise<OrderCancellationReason[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const res = await supabase.from('order_cancellation_reasons').select('*').order('id', { ascending: true });
    if (res.error) return [];
    return (res.data ?? []) as any;
  }

  // Get refund reasons
  async getRefundReasons(): Promise<RefundReason[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const res = await supabase.from('refund_reasons').select('*').order('id', { ascending: true });
    if (res.error) return [];
    return (res.data ?? []) as any;
  }

  // Submit refund request
  async submitRefundRequest(orderId: string, reason: string, image?: File): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { userId, guestId } = await this.getAuthOwner();
    const now = new Date().toISOString();
    
    // Upload image if provided
    let imageUrl = null;
    if (image) {
      try {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `refund-images/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('refunds').upload(filePath, image);
        if (!uploadError) imageUrl = filePath;
      } catch {}
    }

    const payload: any = {
      order_id: orderId,
      reason,
      image: imageUrl,
      created_at: now,
      updated_at: now,
      user_id: userId,
      guest_id: guestId,
    };
    const res = await supabase.from('refund_requests').insert([payload]);
    if (res.error) throw new Error(res.error.message);
    return true;
  }

  // Submit offline payment proof
  async submitOfflinePayment(orderId: string, reference: string, note: string, receipt?: File): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { userId, guestId } = await this.getAuthOwner();
    
    // Upload receipt if provided
    let receiptUrl = null;
    if (receipt) {
      try {
        const fileExt = receipt.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('receipts').upload(filePath, receipt);
        if (!uploadError) receiptUrl = filePath;
      } catch {}
    }

    // Since we don't have an offline_payments table schema, we'll store it in order metadata or a separate table if it existed.
    // For now, let's assume we update the order with payment info.
    // In a real app, this should go to a dedicated table.
    // We will update order_note to include this info for now as a fallback.
    
    const paymentInfo = `Offline Payment Ref: ${reference}. Note: ${note}. Receipt: ${receiptUrl || 'None'}`;
    
    const updateRes = await supabase
      .from('orders')
      .update({ 
        order_note: paymentInfo, // Appending would be better but this is simple
        payment_status: 'review', // distinctive status
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateRes.error) throw new Error(updateRes.error.message);
    return true;
  }

  // Pay with wallet
  async payWithWallet(orderId: string, amount: number): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { userId } = await this.getAuthOwner();
    if (!userId) throw new Error('User not logged in');

    // 1. Get profile balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) throw new Error('Could not fetch wallet balance');
    
    const balance = Number(profile.wallet_balance) || 0;
    if (balance < amount) throw new Error('Insufficient wallet balance');

    // 2. Deduct balance
    const newBalance = balance - amount;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', userId);

    if (updateError) throw new Error('Failed to update wallet balance');

    // 3. Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({ 
        payment_status: 'paid',
        payment_method: 'wallet',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (orderError) throw new Error('Failed to update order status');

    return true;
  }

  // Place a new order
  async placeOrder(orderData: {
    payment_method: 'cash_on_delivery' | 'digital_payment' | 'wallet' | 'offline_payment';
    order_type: 'take_away' | 'delivery' | 'parcel';
    store_id: number;
    distance?: number;
    address?: string;
    longitude?: number;
    latitude?: number;
    order_amount: number;
    coupon_code?: string;
    order_note?: string;
    cutlery?: boolean;
    schedule_at?: string;
    dm_tips?: number;
    parcel_category_id?: number;
    receiver_details?: string;
    charge_payer?: 'sender' | 'receiver';
    contact_person_name?: string;
    contact_person_number?: string;
    contact_person_email?: string;
    guest_id?: string;
  }): Promise<any> {
    try {
      const completeOrderData = {
        ...orderData,
        contact_person_name: orderData.contact_person_name || '',
        contact_person_number: orderData.contact_person_number || '',
        contact_person_email: orderData.contact_person_email || '',
      };

      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
      const { userId, guestId } = await this.getAuthOwner();
      const now = new Date().toISOString();

      let cartQ = supabase
        .from('cart_items')
        .select('item_id, quantity, price, discount, tax, variant, variation, add_ons, add_on_qtys, add_on_prices, item:items(name, image)')
        .order('id', { ascending: true });
      if (userId) cartQ = cartQ.eq('user_id', userId);
      if (guestId) cartQ = cartQ.eq('guest_id', guestId);

      const cartRes = await cartQ;
      if (cartRes.error) throw new Error(cartRes.error.message);
      const cartItems = Array.isArray(cartRes.data) ? cartRes.data : [];

      const orderIns = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            guest_id: guestId,
            store_id: Number(completeOrderData.store_id),
            order_amount: Number(completeOrderData.order_amount) || 0,
            payment_method: completeOrderData.payment_method,
            order_type: completeOrderData.order_type,
            order_note: completeOrderData.order_note ?? '',
            coupon_code: completeOrderData.coupon_code ?? '',
            order_status: 'pending',
            payment_status: completeOrderData.payment_method === 'cash_on_delivery' ? 'unpaid' : 'paid',
            address: completeOrderData.address ?? '',
            longitude: completeOrderData.longitude ?? null,
            latitude: completeOrderData.latitude ?? null,
            created_at: now,
            updated_at: now,
          },
        ])
        .select('*')
        .maybeSingle();
      if (orderIns.error) throw new Error(orderIns.error.message);

      const orderRow: any = orderIns.data;
      const orderId = orderRow?.id;

      if (orderId && cartItems.length > 0) {
        const itemRows = cartItems.map((c: any) => ({
          order_id: orderId,
          item_id: Number(c?.item_id),
          quantity: Number(c?.quantity) || 1,
          price: Number(c?.price) || 0,
          tax_amount: Number(c?.tax) || 0,
          discount_on_item: Number(c?.discount) || 0,
          item_details: JSON.stringify(c?.item ?? {}),
          created_at: now,
          updated_at: now,
        }));

        const oi = await supabase.from('order_items').insert(itemRows);
        if (oi.error) throw new Error(oi.error.message);

        let delQ = supabase.from('cart_items').delete();
        if (userId) delQ = delQ.eq('user_id', userId);
        if (guestId) delQ = delQ.eq('guest_id', guestId);
        const delRes = await delQ;
        if (delRes.error) throw new Error(delRes.error.message);
      }

      return { order: orderRow, order_id: orderId };
    } catch (error) {
      throw error;
    }
  }
}

export default new OrderService();
