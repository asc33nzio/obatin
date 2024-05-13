export interface CartReduxItf {
  id: number;
  userId: number;
  pharmacyId: number;
  imageUrl: string;
  ProductName: string;
  sellingUnit: number;
  quantity: number;
  price: number;
}

export interface PharmacyItf {
  id: number;
  name: string;
  quantity: number;
  address: number;
  city_id: number;
  city?: string;
  lat: string;
  lng: string;
  pharmacist_name: string;
  pharmacist_license: string;
  pharmacist_phone: string;
  opening_time: string;
  closing_time: string;
  operational_days: [];
  partner_id: number;
  distance: number;
  total_weight: number;
  subtotal_pharmacy: number;
  cart_items: CartReduxItf[];
}
