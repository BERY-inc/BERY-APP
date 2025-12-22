import apiClient from './apiClient';

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

class AuthService {
  // User login
  async login(data: Partial<LoginRequest>): Promise<AuthResponse> {
    try {
      // Default to manual login if not specified
      const payload = {
        login_type: 'manual',
        ...data
      };

      const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', payload);
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', error);

      // Extract specific error message from Laravel backend response
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const firstError = error.response.data.errors[0];
        if (firstError?.message) {
          throw new Error(firstError.message);
        }
      }

      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  }

  // User registration
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/v1/auth/sign-up', data);
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Registration error details:', error);

      // Extract specific error message from Laravel backend response
      // Format is typically { errors: [ { code: "...", message: "..." } ] }
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const firstError = error.response.data.errors[0];
        if (firstError?.message) {
          throw new Error(firstError.message);
        }
      }

      // Fallback to generic message
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }

  // Verify OTP
  async verifyOTP(data: VerifyOTPRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/v1/auth/verify-phone', data);

      // Store token in localStorage if returned
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('OTP Verification error details:', error);

      // Extract specific error message
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const firstError = error.response.data.errors[0];
        if (firstError?.message) {
          throw new Error(firstError.message);
        }
      }

      throw new Error(error.response?.data?.message || error.message || 'Verification failed');
    }
  }

  // Check if user exists for wallet transfer
  async checkUser(emailOrPhone: string): Promise<any> {
    try {
      const response = await apiClient.post('/api/v1/customer/wallet/check-user', {
        email_or_phone: emailOrPhone
      });
      return response.data;
    } catch (error: any) {
      console.error('Check User error:', error);
      throw error;
    }
  }

  // Get User Profile
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>('/api/v1/customer/info');
      return response.data;
    } catch (error: any) {
      console.error('Get Profile error:', error);
      throw error;
    }
  }

  async transferFund(amount: number, emailOrPhone: string) {
    const response = await apiClient.post('/api/v1/customer/wallet/fund-transfer', {
      amount,
      recipient: emailOrPhone
    });
    return response.data;
  }

  async getWalletTransactions(limit = 10, offset = 1) {
    const response = await apiClient.get('/api/v1/customer/wallet/transactions', {
      params: { limit, offset }
    });
    return response.data;
  }

  // Logout
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

export default new AuthService();
