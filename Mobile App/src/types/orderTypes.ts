export interface Order {
  id: number;
  user_id: number;
  store_id: number;
  order_amount: number;
  coupon_discount_amount: number;
  coupon_discount_title: string;
  payment_status: string;
  order_status: string;
  total_tax_amount: number;
  payment_method: string;
  coupon_code: string;
  order_note: string;
  order_type: string;
  created_at: string;
  updated_at: string;
  store: {
    name: string;
    logo: string;
  };
  order_items: OrderItem[];
}

export interface OrderItem {
  id: number;
  item_id: number;
  order_id: number;
  item_details: string;
  quantity: number;
  price: number;
  tax_amount: number;
  discount_on_item: number;
  created_at: string;
  updated_at: string;
  item: {
    name: string;
    image: string;
  };
}

export interface PaginatedOrder {
  total_size: number;
  limit: number;
  offset: number;
  orders: Order[];
}

export interface OrderCancellationReason {
  id: number;
  reason: string;
  user_type: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface RefundReason {
  id: number;
  reason: string;
  status: number;
  created_at: string;
  updated_at: string;
}