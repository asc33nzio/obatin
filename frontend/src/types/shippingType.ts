export interface ShippingMethodsType {
  shipping_id: number;
  shipping_method_id: number;
  name: string;
  price: number;
  type: string;
  service: string;
  description: string;
  code: string;
  estimated: string;
}
export interface ShippingOptionType {
  pharmacy_id: number;
  distance: number;
  destination_city_id: number;
  weight: number;
  shipping_methods: ShippingMethodsType[];
}
