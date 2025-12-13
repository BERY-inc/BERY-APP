import apiClient from './apiClient';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  f_name: string;
  l_name: string;
  phone: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  is_phone_verified: number;
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
  email: string;
}

export interface ForgotPasswordRequest {
  phone: string;
}

export interface ResetPasswordRequest {
  reset_token: string;
  password: string;
  password_confirmation: string;
}

class AuthService {
  // User login
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
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
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<any> {
    try {
      const response = await apiClient.post('/api/v1/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<any> {
    try {
      const response = await apiClient.put('/api/v1/auth/reset-password', data);
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
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