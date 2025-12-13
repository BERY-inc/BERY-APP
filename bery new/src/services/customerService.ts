import apiClient from './apiClient';

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
  // Get customer info
  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      const response = await apiClient.get<CustomerInfo>('/api/v1/customer/info');
      return response.data;
    } catch (error) {
      console.error('Error fetching customer info:', error);
      throw error;
    }
  }

  // Update customer profile
  async updateProfile(data: UpdateProfileRequest): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('f_name', data.f_name);
      formData.append('l_name', data.l_name);
      formData.append('email', data.email);
      
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await apiClient.post('/api/v1/customer/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Get address list
  async getAddressList(): Promise<Address[]> {
    try {
      const response = await apiClient.get<{ addresses: Address[] }>('/api/v1/customer/address/list');
      return response.data.addresses;
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  // Add new address
  async addAddress(data: AddressRequest): Promise<any> {
    try {
      const response = await apiClient.post('/api/v1/customer/address/add', data);
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  // Update address
  async updateAddress(id: number, data: AddressRequest): Promise<any> {
    try {
      const response = await apiClient.put(`/api/v1/customer/address/update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  // Delete address
  async deleteAddress(id: number): Promise<any> {
    try {
      const response = await apiClient.delete('/api/v1/customer/address/delete', {
        data: { id }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }
}

export default new CustomerService();