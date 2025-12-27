import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface CustomerInfo {
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
  email: string;
  image: string;
  order_count: number;
  member_since: string;
  loyalty_point: number;
  wallet_balance: number;
}

export interface Address {
  id: number;
  user_id: number;
  contact_person_name: string;
  contact_person_number: string;
  address_type: string;
  address: string;
  latitude: string;
  longitude: string;
  zone_id: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  f_name: string;
  l_name: string;
  email: string;
  image?: File;
}

export interface AddressRequest {
  contact_person_name: string;
  contact_person_number: string;
  address_type: string;
  address: string;
  latitude: string;
  longitude: string;
  zone_id: number;
}

class CustomerService {
  private toNumericId(raw: string): number {
    const s = String(raw || '').replace(/[^a-fA-F0-9]/g, '').slice(0, 12);
    if (!s) return 0;
    const n = Number.parseInt(s, 16);
    return Number.isFinite(n) ? n : 0;
  }

  // Get customer info
  async getCustomerInfo(): Promise<CustomerInfo> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) throw new Error('Not authenticated');

    const res = await supabase
      .from('profiles')
      .select('id, email, phone, first_name, last_name, avatar_url, wallet_balance, loyalty_point, created_at')
      .eq('id', user.id)
      .maybeSingle();
    if (res.error) throw new Error(res.error.message);
    const row: any = res.data ?? {};

    const createdAt = row?.created_at ? new Date(String(row.created_at)) : null;
    const memberSince = createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      : '';

    return {
      id: this.toNumericId(user.id),
      f_name: String(row?.first_name || user.user_metadata?.first_name || '').trim(),
      l_name: String(row?.last_name || user.user_metadata?.last_name || '').trim(),
      phone: String(row?.phone || user.phone || user.user_metadata?.phone || '').trim(),
      email: String(row?.email || user.email || '').trim(),
      image: String(row?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.image || '').trim(),
      order_count: 0,
      member_since: memberSince,
      loyalty_point: Number(row?.loyalty_point) || 0,
      wallet_balance: Number(row?.wallet_balance) || 0,
    };
  }

  // Update customer profile
  async updateProfile(data: UpdateProfileRequest): Promise<any> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) throw new Error('Not authenticated');

    const email = String(data.email || '').trim();
    const firstName = String(data.f_name || '').trim();
    const lastName = String(data.l_name || '').trim();
    const now = new Date().toISOString();

    const profileUpdate: any = {
      first_name: firstName,
      last_name: lastName,
      email: email || user.email,
      updated_at: now,
    };

    const upd = await supabase.from('profiles').update(profileUpdate).eq('user_id', user.id);
    if (upd.error) throw new Error(upd.error.message);

    if (email && email !== user.email) {
      const au = await supabase.auth.updateUser({ email });
      if (au.error) throw new Error(au.error.message);
    }

    return { updated: true };
  }

  // Get address list
  async getAddressList(): Promise<Address[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return [];

    const res = await supabase.from('addresses').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (res.error) throw new Error(res.error.message);
    return (res.data ?? []) as any;
  }

  // Add new address
  async addAddress(data: AddressRequest): Promise<any> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) throw new Error('Not authenticated');

    const now = new Date().toISOString();
    const payload: any = {
      user_id: user.id,
      contact_person_name: data.contact_person_name,
      contact_person_number: data.contact_person_number,
      address_type: data.address_type,
      address: data.address,
      latitude: String(data.latitude),
      longitude: String(data.longitude),
      zone_id: Number(data.zone_id),
      created_at: now,
      updated_at: now,
    };

    const ins = await supabase.from('addresses').insert([payload]).select('*').maybeSingle();
    if (ins.error) throw new Error(ins.error.message);
    return ins.data;
  }

  // Update address
  async updateAddress(id: number, data: AddressRequest): Promise<any> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) throw new Error('Not authenticated');

    const now = new Date().toISOString();
    const upd = await supabase
      .from('addresses')
      .update({
        contact_person_name: data.contact_person_name,
        contact_person_number: data.contact_person_number,
        address_type: data.address_type,
        address: data.address,
        latitude: String(data.latitude),
        longitude: String(data.longitude),
        zone_id: Number(data.zone_id),
        updated_at: now,
      })
      .eq('id', Number(id))
      .eq('user_id', user.id);
    if (upd.error) throw new Error(upd.error.message);
    return { updated: true };
  }

  // Delete address
  async deleteAddress(id: number): Promise<any> {
    if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) throw new Error('Not authenticated');

    const del = await supabase.from('addresses').delete().eq('id', Number(id)).eq('user_id', user.id);
    if (del.error) throw new Error(del.error.message);
    return { deleted: true };
  }
}

export default new CustomerService();
