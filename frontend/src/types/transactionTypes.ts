export type apiFilterMapTypes =
  | 'all'
  | 'waitingUserPayment'
  | 'waitingConfirmation'
  | 'processed'
  | 'sent'
  | 'received'
  | 'cancelled';

export type TxStatusTypes =
  | 'waiting_payment'
  | 'waiting_confirmation'
  | 'processed'
  | 'sent'
  | 'confirmed'
  | 'cancelled';

export interface TxFilterItf {
  all: boolean;
  waitingUserPayment: boolean;
  waitingConfirmation: boolean;
  processed: boolean;
  sent: boolean;
  received: boolean;
  cancelled: boolean;
  [key: string]: boolean;
}

export interface CartItemItf {
  id: number;
  product_id: number;
  pharmacy_product_id: number;
  perscription_id: number | null;
  order_id: number;
  name: string;
  slug: string;
  quantity: number;
  thumbnail_url: string;
  selling_unit: string;
  price: number;
  weight: number;
  isPrescribed: boolean;
}

export interface PharmacyItf {
  id: number;
  name: string;
  address: string;
  city_id: number;
  lat: string;
  lng: string;
  pharmacist_name: string;
  pharmacist_license: string;
  pharmacist_phone: string;
  opening_time: string;
  closing_time: string;
  operational_days: Array<string>;
  partner_id: number;
  distance: number | null;
  total_weight: number;
  subtotal_pharmacy: number;
  cart_items: null;
}

export interface ShippingItf {
  cost: number;
  code: string;
  name: string;
  type: string;
}

export interface TxItf {
  order_id: number;
  payment_id: number;
  user_id?: number;
  user_authentication_id?: number;
  user_name?: string;
  payment_proof_url?: string;
  invoice_number: string;
  status: TxStatusTypes;
  number_items: number;
  subtotal: number;
  created_at: string;
  shipping: ShippingItf;
  pharmacy: PharmacyItf;
  cart_items: Array<CartItemItf>;
  handleOpenViewMore?: () => void;
  handleConfirmOrder?: (order_id: number) => void;
  isLoading?: boolean;
}

export interface PaginationInfoItf {
  limit: number;
  page: number;
  page_count: number;
  total_records: number;
}

export interface PaymentItf {
  id: number;
  invoice_number: string;
  user_id: number;
  payment_method: string;
  total_payment: number;
  payment_proof_url: string;
  is_confirmed: boolean;
  created_at: string;
}
