export type PharmacyProductType = {
  id: number;
  product_id: number;
  product_name: string;
  slug: string;
  image_url: string;
  pharmacy_id: string;
  pharmacy_name: string;
  price: number;
  stock: number;
  is_active: boolean;
  sales: number;
};
