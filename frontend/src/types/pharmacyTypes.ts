import { ProductItemItf } from '@/redux/reducers/cartSlice';

export interface PharmacyItf {
  id?: number;
  name?: string;
  quantity?: number;
  address?: string;
  city_id?: number;
  lat?: string;
  lng?: string;
  pharmacist_name?: string;
  pharmacist_license?: string;
  pharmacist_phone?: string;
  opening_time?: string;
  closing_time?: string;
  operational_days?: string[];
  partner_id?: number;
  distance?: number;
  total_weight?: number;
  shipping_id?: number;
  shipping_name?: string;
  shipping_cost?: number;
  subtotal_pharmacy?: number;
  cart_items?: ProductItemItf[];
}
