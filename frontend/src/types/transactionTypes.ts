export type TxStatusTypes =
  | 'waitingUserPayment'
  | 'waitingConfirmation'
  | 'processed'
  | 'sent'
  | 'received'
  | 'cancelled';

export interface TxFilterItf {
  all: boolean;
  waitingUserPayment: boolean;
  waitingConfirmation: boolean;
  processed: boolean;
  sent: boolean;
  received: boolean;
  cancelled: boolean;
}

export interface CartItemItf {
  cartItemId: number;
  productId: number;
  pharmacyProductId: number;
  perscriptionId: number | null;
  orderId: number;
  name: string;
  slug: string;
  quantity: number;
  thumbnailUrl: string;
  sellingUnit: string;
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
  invoice_number: string;
  status: TxStatusTypes;
  number_items: number;
  subtotal: number;
  created_at: string;
  shipping: ShippingItf;
  pharmacy: PharmacyItf;
  cart_items: Array<CartItemItf>;
  handleOpenViewMore?: () => void;
}

export interface PaginationInfoItf {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalEntries: number;
}
