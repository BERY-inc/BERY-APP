import pauketClient from './pauketClient';
import { 
  Category,
  Campaign,
  CampaignDetails,
  Coupon,
  UserCoupon,
  GetCampaignsRequest,
  GetCampaignDetailsRequest,
  ActivateCouponRequest,
  GetMyCouponsRequest,
  CouponStatus
} from '../types/pauketTypes';

class PauketService {
  // Get category list - only categories with at least one coupon
  async getCategoryList(): Promise<Category[]> {
    try {
      const response = await pauketClient.getCategoryList();
      return response.categories;
    } catch (error) {
      console.error('Failed to fetch category list:', error);
      throw error;
    }
  }

  // Get campaigns with optional filtering
  async getCampaigns(options: {
    search?: string;
    custId?: string;
    categoryId?: string;
    page?: number;
  } = {}): Promise<{ campaigns: Campaign[]; totalCount: number; currentPage: number; totalPages: number }> {
    try {
      const params: GetCampaignsRequest = {
        search: options.search,
        CustID: options.custId,
        category_id: options.categoryId,
        page: options.page
      };

      const response = await pauketClient.getCampaigns(params);
      return {
        campaigns: response.campaigns,
        totalCount: response.total_count,
        currentPage: response.current_page,
        totalPages: response.total_pages
      };
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      throw error;
    }
  }

  // Get campaign details
  async getCampaignDetails(sourceLink: string, custId?: string): Promise<CampaignDetails> {
    try {
      const params: GetCampaignDetailsRequest = {
        source_link: sourceLink,
        cust_id: custId
      };

      const response = await pauketClient.getCampaignDetails(params);
      return response.campaign;
    } catch (error) {
      console.error('Failed to fetch campaign details:', error);
      throw error;
    }
  }

  // Activate a coupon
  async activateCoupon(sourceLink: string, custId?: string): Promise<{
    coupons: Coupon[];
    merchantLogo: string;
    offer: string;
    redirectUrl: string;
    couponCode: string;
    isCTAValid: boolean;
    CTAName: string;
    CTARedirect: string;
  }> {
    try {
      const params: ActivateCouponRequest = {
        source_link: sourceLink,
        cust_id: custId
      };

      const response = await pauketClient.activateCoupon(params);
      return {
        coupons: response.coupons,
        merchantLogo: response.merchant_logo,
        offer: response.offer,
        redirectUrl: response.redirect_url,
        couponCode: response.coupon_code,
        isCTAValid: response.isCTAvalid,
        CTAName: response.CTAname,
        CTARedirect: response.CTAredirect
      };
    } catch (error) {
      console.error('Failed to activate coupon:', error);
      throw error;
    }
  }

  // Get user's coupons
  async getMyCoupons(custId: string, couponStatus: CouponStatus = 'all', page: number = 1): Promise<{
    coupons: UserCoupon[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    try {
      const params: GetMyCouponsRequest = {
        cust_id: custId,
        coupon_status: couponStatus,
        page: page
      };

      const response = await pauketClient.getMyCoupons(params);
      return {
        coupons: response.coupons,
        totalCount: response.total_count,
        currentPage: response.current_page,
        totalPages: response.total_pages
      };
    } catch (error) {
      console.error('Failed to fetch user coupons:', error);
      throw error;
    }
  }
}

export default new PauketService();