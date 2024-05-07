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

export interface ProductItf {
  productId: number;
  pharmacyProductId: number;
  perscriptionId: number | null;
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
  cityId: number;
  name: string;
  address: string;
  lat: string;
  lng: string;
  pharmacistName: string;
  pharmacistLicense: string;
  pharmacistPhone: string;
  partnerId: number;
}

export interface ShippingItf {
  cost: number;
  code: string;
  name: string;
  type: string;
}

export interface OrderItf {
  status: TxStatusTypes;
  totalAmount: number;
  invoiceNumber: string;
  pharmacy: PharmacyItf;
  products: Array<ProductItf>;
  createdAt: string;
  shippingInfo: ShippingItf;
}

export interface PaginationInfoItf {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalEntries: number;
}
