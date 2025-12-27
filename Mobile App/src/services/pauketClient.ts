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
  private config: PauketConfig;
  private baseURL: string;

  constructor() {
    // Initialize with default config - will be updated with actual values
    this.config = {
      partnerName: (import.meta as any).env.VITE_PAUKET_PARTNER_NAME || '',
      apiKey: import.meta.env.VITE_PAUKET_API_KEY || '',
      isSandbox: import.meta.env.VITE_PAUKET_SANDBOX === 'true'
    };

    // Set base URL based on environment
    this.baseURL = this.config.isSandbox 
      ? 'https://stage-api.pauket.com/api/partner'
      : 'https://api.pauket.com/api/partner';
  }

  // Update configuration
  setConfig(config: Partial<PauketConfig>) {
    this.config = { ...this.config, ...config };
    // Update base URL if sandbox setting changes
    if (config.isSandbox !== undefined) {
      this.baseURL = this.config.isSandbox 
        ? 'https://stage-api.pauket.com/api/partner'
        : 'https://api.pauket.com/api/partner';
    }
  }

  // Helper for making requests
  private async request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'partner-name': this.config.partnerName,
      'api-key': this.config.apiKey
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      
      if (!response.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }
        
        throw this.normalizeError(response.status, errorData);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  }

  // Normalize errors to user-friendly messages
  private normalizeError(status: number, data: any): Error {
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
  }

  // Category List API
  async getCategoryList(): Promise<GetCategoryListResponse> {
    return this.request<GetCategoryListResponse>('/get_category_list');
  }

  // Get Campaigns API
  async getCampaigns(params: GetCampaignsRequest): Promise<GetCampaignsResponse> {
    return this.request<GetCampaignsResponse>('/get_campaigns', 'POST', params);
  }

  // Get Campaign Details API
  async getCampaignDetails(params: GetCampaignDetailsRequest): Promise<GetCampaignDetailsResponse> {
    return this.request<GetCampaignDetailsResponse>('/get_campaign_details', 'POST', params);
  }

  // Activate Coupon API
  async activateCoupon(params: ActivateCouponRequest): Promise<ActivateCouponResponse> {
    return this.request<ActivateCouponResponse>('/activate_coupon', 'POST', params);
  }

  // My Coupons API
  async getMyCoupons(params: GetMyCouponsRequest): Promise<GetMyCouponsResponse> {
    return this.request<GetMyCouponsResponse>('/my_coupons', 'POST', params);
  }
}

export default new PauketClient();
