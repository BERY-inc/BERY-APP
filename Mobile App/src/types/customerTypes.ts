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