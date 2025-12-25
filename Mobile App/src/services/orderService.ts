// Order service for 6amMart user app integration
import apiClient from './apiClient';
import { Order, PaginatedOrder, OrderCancellationReason, RefundReason } from '../types/orderTypes';

class OrderService {
  private async ensureZoneAndModule(): Promise<void> {
    const zoneId = localStorage.getItem('zoneId');
    if (!zoneId) {
      try {
        const response = await apiClient.get<any>('/api/v1/zone/list');
        const data = response.data;
        const zones = Array.isArray(data) ? data : (data?.zones ?? data?.data ?? []);
        const zoneIds = Array.isArray(zones)
          ? zones.map((z: any) => Number(z?.id)).filter((id: number) => Number.isFinite(id))
          : [];
        const firstZoneId = zoneIds.length > 0 ? zoneIds[0] : null;
        if (firstZoneId !== null) {
          try { localStorage.setItem('zoneId', JSON.stringify([firstZoneId])); } catch {}
        }
      } catch {
        try { localStorage.setItem('zoneId', JSON.stringify([1])); } catch {}
      }
    }

    const moduleId = localStorage.getItem('moduleId');
    if (!moduleId) {
      try {
        const response = await apiClient.get<any>('/api/v1/module');
        const data = response.data;
        const modules = Array.isArray(data) ? data : (data?.data ?? data?.modules ?? []);
        const first = Array.isArray(modules) && modules.length > 0 ? modules[0] : null;
        const resolvedId = first?.id ? String(first.id) : '1';
        try { localStorage.setItem('moduleId', resolvedId); } catch {}
      } catch {
        try { localStorage.setItem('moduleId', '1'); } catch {}
      }
    }
  }

  // Get running orders
  async getRunningOrders(offset: number = 1, limit: number = 10): Promise<PaginatedOrder> {
    try {
      const response = await apiClient.get<PaginatedOrder>(
        `/api/v1/customer/order/running-orders?offset=${offset}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
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
      throw error;
    }
  }

  // Place a new order
  async placeOrder(orderData: {
    payment_method: 'cash_on_delivery' | 'digital_payment' | 'wallet' | 'offline_payment';
    order_type: 'take_away' | 'delivery' | 'parcel';
    store_id: number;
    distance?: number;
    address?: string;
    longitude?: number;
    latitude?: number;
    order_amount: number;
    coupon_code?: string;
    order_note?: string;
    cutlery?: boolean;
    schedule_at?: string;
    dm_tips?: number;
    parcel_category_id?: number;
    receiver_details?: string;
    charge_payer?: 'sender' | 'receiver';
    contact_person_name?: string;
    contact_person_number?: string;
    contact_person_email?: string;
    guest_id?: string;
  }): Promise<any> {
    try {
      await this.ensureZoneAndModule();

      // Ensure all required fields are present
      const completeOrderData = {
        ...orderData,
        contact_person_name: orderData.contact_person_name || '',
        contact_person_number: orderData.contact_person_number || '',
        contact_person_email: orderData.contact_person_email || '',
      };
      
      const response = await apiClient.post('/api/v1/customer/order/place', completeOrderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }}

export default new OrderService();
