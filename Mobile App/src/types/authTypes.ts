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