import axios, { AxiosInstance } from 'axios';
import { 
  PauketConfig,
  GetCategoryListResponse,
  GetCampaignsRequest,
  GetCampaignsResponse,
  GetCampaignDetailsRequest,
  GetCampaignDetailsResponse,
  ActivateCouponRequest,
  ActivateCouponResponse,
  GetMyCouponsRequest,
  GetMyCouponsResponse
} from '../types/pauketTypes';

class PauketClient {
  private apiClient: AxiosInstance;
  private config: PauketConfig;

  constructor() {
    // Initialize with default config - will be updated with actual values
    this.config = {
      partnerName: import.meta.env.VITE_PAUKET_PARTNER_NAME || '',
      apiKey: import.meta.env.VITE_PAUKET_API_KEY || '',
      isSandbox: import.meta.env.VITE_PAUKET_SANDBOX === 'true'
    };

    // Set base URL based on environment
    const baseURL = this.config.isSandbox 
      ? 'https://stage-api.pauket.com/api/partner'
      : 'https://api.pauket.com/api/partner';

    // Create axios instance
    this.apiClient = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor to attach auth headers
    this.apiClient.interceptors.request.use(
      (config) => {
        // Attach required authentication headers
        config.headers['partner-name'] = this.config.partnerName;
        config.headers['api-key'] = this.config.apiKey;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  // Update configuration
  setConfig(config: Partial<PauketConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Normalize errors to user-friendly messages
  private normalizeError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Bad Request - Please check your request parameters');
        case 401:
          return new Error('Unauthorized - Invalid API key or partner name');
        case 403:
          return new Error('Forbidden - You do not have permission to access this resource');
        case 404:
          return new Error('Not Found - The requested resource could not be found');
        case 429:
          return new Error('Rate Limit Exceeded - Please try again later');
        case 500:
          return new Error('Internal Server Error - Please try again later');
        default:
          return new Error(data.message || `API Error (${status})`);
      }
    } else if (error.request) {
      return new Error('Network Error - Please check your internet connection');
    } else {
      return new Error(error.message || 'An unknown error occurred');
    }
  }

  // Category List API
  async getCategoryList(): Promise<GetCategoryListResponse> {
    try {
      const response = await this.apiClient.get<GetCategoryListResponse>('/get_category_list');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get Campaigns API
  async getCampaigns(params: GetCampaignsRequest): Promise<GetCampaignsResponse> {
    try {
      const response = await this.apiClient.post<GetCampaignsResponse>('/get_campaigns', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get Campaign Details API
  async getCampaignDetails(params: GetCampaignDetailsRequest): Promise<GetCampaignDetailsResponse> {
    try {
      const response = await this.apiClient.post<GetCampaignDetailsResponse>('/get_campaign_details', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Activate Coupon API
  async activateCoupon(params: ActivateCouponRequest): Promise<ActivateCouponResponse> {
    try {
      const response = await this.apiClient.post<ActivateCouponResponse>('/activate_coupon', params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // My Coupons API
  async getMyCoupons(params: GetMyCouponsRequest): Promise<GetMyCouponsResponse> {
    try {
      const response = await this.apiClient.post<GetMyCouponsResponse>('/my_coupons', params);
      return response.data;
    } catch (error) {
      console.error('Get My Coupons Error:', error);
      throw error;
    }
  }
}

export default new PauketClient();
