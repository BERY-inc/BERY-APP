# Pauket Coupon Connect API Integration

This document explains how the Pauket Coupon Connect API has been integrated into the Bery Market application.

## Overview

The Pauket Coupon Connect API integration enables users to:
1. Browse coupon categories
2. View available campaigns
3. Access detailed campaign information
4. Activate coupons
5. Manage their coupon wallet

## API Endpoints Implemented

All endpoints are implemented following Pauket's API specification:

1. **Category List API** (`/get_category_list`)
   - Retrieves categories that have at least one coupon
   - Used to populate the category browsing screen

2. **Get Campaigns API** (`/get_campaigns`)
   - Retrieves paginated list of campaigns
   - Supports search, category filtering, and user personalization
   - Used in the campaign browsing screen

3. **Get Campaign Details API** (`/get_campaign_details`)
   - Retrieves detailed information about a specific campaign
   - Shows offer details, terms, and usage instructions

4. **Activate Coupon API** (`/activate_coupon`)
   - Activates a coupon for a user
   - Returns coupon code and QR code for redemption

5. **Coupon Wallet API** (`/my_coupons`)
   - Retrieves user's coupons with filtering by status
   - Supports pagination for large coupon collections

## Security & Configuration

### Environment Variables

The integration uses the following environment variables:

```env
VITE_PAUKET_PARTNER_NAME=your_partner_name_here
VITE_PAUKET_API_KEY=your_api_key_here
VITE_PAUKET_SANDBOX=true
```

- `VITE_PAUKET_PARTNER_NAME`: Your Pauket partner name
- `VITE_PAUKET_API_KEY`: Your Pauket API key
- `VITE_PAUKET_SANDBOX`: Set to `true` for sandbox/testing, `false` for production

### Authentication

All API requests include the required headers:
- `partner-name`: Set from `VITE_PAUKET_PARTNER_NAME`
- `api-key`: Set from `VITE_PAUKET_API_KEY`

HTTPS is enforced for all requests.

## Architecture

The integration follows a clean architecture pattern with three layers:

1. **Types Layer** (`src/types/pauketTypes.ts`)
   - TypeScript interfaces for all API entities
   - Type safety across the application

2. **Client Layer** (`src/services/pauketClient.ts`)
   - Low-level HTTP client using Axios
   - Handles authentication headers
   - Base URL switching between sandbox/production
   - Error normalization

3. **Service Layer** (`src/services/pauketService.ts`)
   - High-level business logic
   - Simplified interfaces for UI components
   - Data transformation and pagination handling

4. **UI Components** (in `src/components/`)
   - `Coupons.tsx`: Main entry point with category/my coupons tabs
   - `CouponCampaigns.tsx`: Campaign browsing with search and filtering
   - `CouponDetails.tsx`: Detailed campaign view with activation
   - `CouponSuccess.tsx`: Success screen after coupon activation
   - `MyCoupons.tsx`: User's coupon wallet with status filtering

## Usage Flow

1. User navigates to "Offers" from the dashboard
2. Views categories and selects one to browse campaigns
3. Searches or browses campaigns
4. Selects a campaign to view details
5. Activates the coupon
6. Views success screen with QR code
7. Can access "My Coupons" to manage activated coupons

## Error Handling

The integration includes comprehensive error handling:
- Network errors
- Authentication failures
- Rate limiting
- API-specific error codes
- User-friendly error messages

## Testing

Unit tests should be added for:
- Service functions with mocked API responses
- Error scenarios
- Pagination functionality
- Data transformation logic

## Future Enhancements

Potential improvements:
- Offline caching of categories and campaigns
- Push notifications for expiring coupons
- Integration with user's transaction history
- Social sharing of offers