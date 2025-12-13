// Order service for 6amMart user app integration
import apiClient from './apiClient';
import { Order, PaginatedOrder, OrderCancellationReason, RefundReason } from '../types/orderTypes';

class OrderService {
  // Get running orders
  async getRunningOrders(offset: number = 1, limit: number = 10): Promise<PaginatedOrder> {
    try {
      const response = await apiClient.get<PaginatedOrder>(
        `/api/v1/customer/order/running-orders?offset=${offset}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching running orders:', error);
      throw error;
    }
  }

  // Get order history
  async getOrderHistory(offset: number = 1, limit: number = 10): Promise<PaginatedOrder> {
    try {
      const response = await apiClient.get<PaginatedOrder>(
        `/api/v1/customer/order/list?offset=${offset}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw error;
    }
  }

  // Get order details
  async getOrderDetails(orderId: string): Promise<Order[]> {
    try {
      const response = await apiClient.get<Order[]>(
        `/api/v1/customer/order/details?order_id=${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Track order
  async trackOrder(orderId: string): Promise<Order[]> {
    try {
      const response = await apiClient.get<Order[]>(
        `/api/v1/customer/order/track?order_id=${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error tracking order:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId: string, reason: string): Promise<boolean> {
    try {
      const response = await apiClient.post(
        '/api/v1/customer/order/cancel',
        {
          _method: 'put',
          order_id: orderId,
          reason: reason
        }
      );
      
      return response.status === 200;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }

  // Get order cancellation reasons
  async getCancellationReasons(): Promise<OrderCancellationReason[]> {
    try {
      const response = await apiClient.get<{ reasons: OrderCancellationReason[] }>(
        '/api/v1/customer/order/cancellation-reasons?offset=1&limit=30&type=customer'
      );
      return response.data.reasons;
    } catch (error) {
      console.error('Error fetching cancellation reasons:', error);
      throw error;
    }
  }

  // Get refund reasons
  async getRefundReasons(): Promise<RefundReason[]> {
    try {
      const response = await apiClient.get<{ refundReasons: RefundReason[] }>(
        '/api/v1/customer/order/refund-reasons'
      );
      return response.data.refundReasons;
    } catch (error) {
      console.error('Error fetching refund reasons:', error);
      throw error;
    }
  }

  // Submit refund request
  async submitRefundRequest(orderId: string, reason: string, image?: File): Promise<boolean> {
    try {
      // For file uploads, we would need to use FormData
      // This is a simplified version
      const response = await apiClient.post(
        '/api/v1/customer/order/refund-request',
        {
          order_id: orderId,
          reason: reason,
          image: image ? 'uploaded' : null
        }
      );
      
      return response.status === 200;
    } catch (error) {
      console.error('Error submitting refund request:', error);
      throw error;
    }
  }
}

export default new OrderService();