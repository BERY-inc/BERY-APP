export interface Store {
  id: number;
  name: string;
  address: string;
  logo: string;
  cover_photo: string;
  latitude: string;
  longitude: string;
  rating_count: number;
  avg_rating: number;
  discount: number;
  delivery_time: string;
  minimum_order: number;
  tax: number;
  vat: number;
  price_range_min: number;
  price_range_max: number;
  free_delivery: number;
  featured: number;
  active: number;
  approved: number;
}

export interface StoreDetails extends Store {
  description: string;
  phone: string;
  email: string;
  website: string;
  schedule_order: number;
  opening_time: string;
  closeing_time: string;
  zone_id: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  parent_id: number;
  position: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: number;
  title: string;
  image: string;
  store_id: number;
  item_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}