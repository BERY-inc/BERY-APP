// Pauket Coupon Connect API Types

// Environment Configuration
export interface PauketConfig {
  partnerName: string;
  apiKey: string;
  isSandbox: boolean;
}

// Category List API
export interface Category {
  id: string;
  name: string;
  image: string;
  campaign_count: number;
}

export interface GetCategoryListResponse {
  categories: Category[];
  total_count: number;
}

// Get Campaigns API
export interface Campaign {
  id: string;
  source_link: string;
  campaign_name: string;
  thumbnail: string;
  cover_image: string;
  offer_to_show: string;
  merchant_name: string;
  category_name: string;
  category_id: string;
  expiry_date: string;
  campaign_type: string;
  offer_type: string;
  discount: string;
  threshold_amount: string;
}

export interface GetCampaignsRequest {
  search?: string;
  CustID?: string;
  category_id?: string;
  page?: number;
}

export interface GetCampaignsResponse {
  campaigns: Campaign[];
  total_count: number;
  current_page: number;
  total_pages: number;
}

// Get Campaign Details API
export interface CampaignDetails {
  campaign_name: string;
  merchant_name: string;
  expiry_date: string;
  offer_to_show: string;
  cover_image: string;
  how_to_use: string; // HTML content
  terms_and_conditions: string; // HTML content
  campaign_type: string;
  offer_type: string;
  discount: string;
  threshold_amount: string;
  source_link: string;
}

export interface GetCampaignDetailsRequest {
  source_link: string;
  cust_id?: string;
}

export interface GetCampaignDetailsResponse {
  campaign: CampaignDetails;
}

// Activate Coupon API
export interface Coupon {
  coupon_code: string;
  qr_code: string;
  expiry_date: string;
}

export interface ActivateCouponRequest {
  source_link: string;
  cust_id?: string;
}

export interface ActivateCouponResponse {
  coupons: Coupon[];
  merchant_logo: string;
  offer: string;
  redirect_url: string;
  coupon_code: string;
  isCTAvalid: boolean;
  CTAname: string;
  CTAredirect: string;
}

// My Coupons API
export type CouponStatus = 'all' | 'activated' | 'claimed' | 'expired';

export interface UserCoupon {
  id: string;
  merchant_name: string;
  campaign_name: string;
  offer_to_show: string;
  coupon_code: string;
  coupon_status: string;
  expiry_date: string;
  qr_code: string;
  isCTAvalid: boolean;
  CTAname: string;
  CTAredirect: string;
  locations?: string[]; // Optional location list
}

export interface GetMyCouponsRequest {
  cust_id: string;
  coupon_status: CouponStatus;
  page?: number;
}

export interface GetMyCouponsResponse {
  coupons: UserCoupon[];
  total_count: number;
  current_page: number;
  total_pages: number;
}