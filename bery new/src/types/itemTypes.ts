export interface Item {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  discount_type: string;
  available_time_starts: string;
  available_time_ends: string;
  veg: number;
  status: number;
  store_id: number;
  category_id: number;
  rating_count: number;
  avg_rating: number;
  created_at: string;
  updated_at: string;
}

export interface ItemDetails extends Item {
  images: string[];
  choice_options: any[];
  variations: any[];
  add_ons: any[];
  tags: string[];
  organic: number;
  stock: number;
}

export interface CartItem {
  item_id: number;
  item: Item;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  variant: string;
  variation: any[];
  add_ons: any[];
  add_on_qtys: number[];
  add_on_prices: number[];
}

export interface AddToCartRequest {
  item_id: number;
  quantity: number;
  variant?: string;
  variation?: any[];
  add_ons?: number[];
  add_on_qtys?: number[];
}

export interface WishlistItem {
  id: number;
  user_id: number;
  item_id: number;
  created_at: string;
  updated_at: string;
  item: Item;
}