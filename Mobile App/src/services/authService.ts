import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface LoginRequest {
  email_or_phone: string;
  password: string;
  login_type: 'manual' | 'otp' | 'social';
  field_type: 'email' | 'phone';
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  is_phone_verified: number;
  is_email_verified: number;
  is_personal_info: number;
  is_exist_user: any;
  login_type: string;
  email: string;
}
export interface VerifyOTPRequest {
  otp: string;
  verification_type: 'email' | 'phone';
  login_type: 'manual' | 'otp';
  email?: string;
  phone?: string;
  guest_id?: string;
}

// Profile Interface matching backend response
export interface UserProfile {
  id: number;
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  image: string;
  is_phone_verified: number;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  order_count?: number;
  member_since_days?: number;
  wallet_balance?: number;
  loyalty_point?: number;
  ref_code?: string;
}

// Wallet Transaction Interface
export interface WalletTransaction {
  transaction_id: string;
  transaction_type: string;
  debit: number;
  credit: number;
  balance: number;
  created_at: string;
  reference: string;
}

const splitName = (raw: string): { firstName: string; lastName: string } => {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

const toNumericId = (raw: string): number => {
  const s = String(raw || '').replace(/[^a-fA-F0-9]/g, '').slice(0, 12);
  if (!s) return 0;
  const n = Number.parseInt(s, 16);
  return Number.isFinite(n) ? n : 0;
};

class AuthService {
  hasMarketToken(): boolean {
    try {
      const token = localStorage.getItem('authToken');
      return !!token?.trim();
    } catch {
      return false;
    }
  }

  async hasSession(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { data, error } = await supabase.auth.getSession();
    if (error) return false;
    try {
      const token = data.session?.access_token;
      if (token) localStorage.setItem('authToken', token);
    } catch {}
    return !!data.session;
  }

  // User login
  async login(data: Partial<LoginRequest>): Promise<AuthResponse> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const emailOrPhone = String(data.email_or_phone ?? '').trim();
    const password = String(data.password ?? '');

    const isEmail = /\S+@\S+\.\S+/.test(emailOrPhone);
    if (!isEmail) {
      throw new Error('Login requires an email address');
    }

    const { data: sb, error } = await supabase.auth.signInWithPassword({
      email: emailOrPhone,
      password,
    });
    if (error) throw new Error(error.message);

    const token = sb.session?.access_token || '';
    try {
      if (token) localStorage.setItem('authToken', token);
    } catch {}
    return {
      token,
      is_phone_verified: sb.user?.phone_confirmed_at ? 1 : 0,
      is_email_verified: sb.user?.email_confirmed_at ? 1 : 0,
      is_personal_info: 1,
      is_exist_user: true,
      login_type: 'supabase',
      email: sb.user?.email || emailOrPhone,
    };
  }

  // User registration
  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const email = String(data.email || '').trim();
    const password = String(data.password || '');
    const phone = String(data.phone || '').trim();
    const { firstName, lastName } = splitName(data.name);

    const { data: sb, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: data.name,
          phone,
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) throw new Error(error.message);

    const token = sb.session?.access_token || '';
    try {
      if (token) localStorage.setItem('authToken', token);
    } catch {}
    return {
      token,
      is_phone_verified: sb.user?.phone_confirmed_at ? 1 : 0,
      is_email_verified: sb.user?.email_confirmed_at ? 1 : 0,
      is_personal_info: 1,
      is_exist_user: false,
      login_type: 'supabase',
      email: sb.user?.email || email,
    };
  }

  // Verify OTP
  async verifyOTP(data: VerifyOTPRequest): Promise<AuthResponse> {
    throw new Error(`OTP verification is not implemented (${data.verification_type})`);
  }

  // Check if user exists for wallet transfer
  async checkUser(emailOrPhone: string): Promise<any> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const query = String(emailOrPhone || '').trim();
    if (!query) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, email, phone, first_name, last_name, avatar_url')
      .or(`email.ilike.${query},phone.eq.${query}`)
      .limit(1);

    if (error) throw new Error(error.message);
    const u = Array.isArray(data) && data.length > 0 ? data[0] : null;
    if (!u) return null;

    return {
      id: toNumericId(String(u.user_id)),
      f_name: u.first_name || '',
      l_name: u.last_name || '',
      email: u.email || '',
      phone: u.phone || '',
      image: u.avatar_url || '',
      name: `${u.first_name || ''} ${u.last_name || ''}`.trim(),
    };
  }

  // Get User Profile
  async getProfile(): Promise<UserProfile> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) throw new Error('Not authenticated');

    const { data: row, error: rowError } = await supabase
      .from('profiles')
      .select('id, email, phone, first_name, last_name, avatar_url, wallet_balance, loyalty_point, ref_code, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle();
    if (rowError) throw new Error(rowError.message);

    const meta: any = user.user_metadata || {};
    const fallbackName = splitName(String(meta.name || ''));
    const resolvedFirst = String(row?.first_name || meta.first_name || fallbackName.firstName || '').trim();
    const resolvedLast = String(row?.last_name || meta.last_name || fallbackName.lastName || '').trim();
    const resolvedPhone = String(row?.phone || user.phone || meta.phone || '').trim();
    const resolvedImage = String(row?.avatar_url || meta.avatar_url || meta.image || '').trim();

    return {
      id: toNumericId(user.id),
      f_name: resolvedFirst,
      l_name: resolvedLast,
      email: String(row?.email || user.email || '').trim(),
      phone: resolvedPhone,
      image: resolvedImage,
      is_phone_verified: user.phone_confirmed_at ? 1 : 0,
      email_verified_at: user.email_confirmed_at ?? null,
      created_at: row?.created_at || user.created_at,
      updated_at: row?.updated_at || (user.updated_at as any) || user.created_at,
      wallet_balance: typeof row?.wallet_balance === 'number' ? row.wallet_balance : undefined,
      loyalty_point: typeof row?.loyalty_point === 'number' ? row.loyalty_point : undefined,
      ref_code: typeof row?.ref_code === 'string' ? row.ref_code : undefined,
    };
  }

  async transferFund(amount: number, emailOrPhone: string) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) throw new Error('Not authenticated');

    const recipient = await this.checkUser(emailOrPhone);
    if (!recipient?.email && !recipient?.phone) throw new Error('Recipient not found');

    const { data: senderProfile, error: senderError } = await supabase
      .from('profiles')
      .select('id, user_id, wallet_balance')
      .eq('user_id', user.id)
      .single();
    if (senderError) throw new Error(senderError.message);

    const { data: receiverProfile, error: receiverError } = await supabase
      .from('profiles')
      .select('id, user_id, wallet_balance')
      .or(`email.ilike.${emailOrPhone.trim()},phone.eq.${emailOrPhone.trim()}`)
      .single();
    if (receiverError) throw new Error(receiverError.message);

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) throw new Error('Invalid amount');
    const senderBalance = Number(senderProfile.wallet_balance || 0);
    if (senderBalance < numericAmount) throw new Error('Insufficient balance');

    const senderNext = senderBalance - numericAmount;
    const receiverNext = Number(receiverProfile.wallet_balance || 0) + numericAmount;

    const { error: updateSenderError } = await supabase
      .from('profiles')
      .update({ wallet_balance: senderNext })
      .eq('id', senderProfile.id);
    if (updateSenderError) throw new Error(updateSenderError.message);

    const { error: updateReceiverError } = await supabase
      .from('profiles')
      .update({ wallet_balance: receiverNext })
      .eq('id', receiverProfile.id);
    if (updateReceiverError) throw new Error(updateReceiverError.message);

    const reference =
      typeof globalThis.crypto?.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const now = new Date().toISOString();

    const { error: txError } = await supabase.from('wallet_transactions').insert([
      {
        user_id: senderProfile.id,
        transaction_id: reference,
        transaction_type: 'fund_transfer',
        debit: numericAmount,
        credit: 0,
        balance: senderNext,
        reference,
        created_at: now,
      },
      {
        user_id: receiverProfile.id,
        transaction_id: reference,
        transaction_type: 'fund_transfer_received',
        debit: 0,
        credit: numericAmount,
        balance: receiverNext,
        reference,
        created_at: now,
      },
    ]);
    if (txError) throw new Error(txError.message);

    return { status: true, reference };
  }

  async getWalletTransactions(limit = 10, offset = 1): Promise<WalletTransaction[]> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);
    const user = userData.user;
    if (!user) throw new Error('Not authenticated');

    const numericLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const numericOffset = Math.max(1, Number(offset) || 1);
    const from = (numericOffset - 1) * numericLimit;
    const to = from + numericLimit - 1;

    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('transaction_id, transaction_type, debit, credit, balance, created_at, reference')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  }

  // Logout
  async logout(): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      try {
        localStorage.removeItem('authToken');
      } catch {}
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.hasMarketToken();
  }
}

export default new AuthService();
