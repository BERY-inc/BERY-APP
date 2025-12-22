# 6amMart API Integration

This project connects to the 6amMart marketplace API to provide a complete user experience for customers.

## API Services

The following services have been implemented to connect to the 6amMart backend:

### Authentication Service
- User login and registration
- Password reset functionality
- Token management

### Customer Service
- Profile management
- Address management
- Customer information retrieval

### Store Service
- Store listings and details
- Category browsing
- Banner management

### Item Service
- Product listings and details
- Search functionality
- Cart management

### Order Service
- Order history and tracking
- Order placement
- Cancellation and refund requests

### Wishlist Service
- Wishlist management
- Add/remove items

## Environment Configuration

Create a `.env` file with the following variable:

```
VITE_API_BASE_URL=http://localhost:8000
```

Replace with your actual API base URL.

## Usage

Import the services in your components:

```typescript
import { authService, storeService, itemService } from '../services';

// Example usage
const login = async () => {
  try {
    const response = await authService.login({
      phone: '1234567890',
      password: 'password123'
    });
    console.log('Login successful', response);
  } catch (error) {
    console.error('Login failed', error);
  }
};
```

## Available Services

- `authService` - Authentication related functions
- `customerService` - Customer profile and address management
- `storeService` - Store and category browsing
- `itemService` - Product and cart management
- `orderService` - Order management
- `wishlistService` - Wishlist functionality

Each service provides methods that directly correspond to the 6amMart API endpoints.