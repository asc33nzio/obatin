import { PaginationParamsItf } from './request';

export type Category = {
  id: number;
  name: string;
  categorySlug: string;
  imageUrl: string;
  catagoryLevel: string;
  hasChild: string;
  parentId: number;
};

export type ProductType = {
  id: number;
  manufacturer_id: string;
  name: string;
  product_slug: string;
  general_indication: string;
  dosage: string;
  how_to_use: string;
  side_effects: string;
  contraindication: string;
  warning: string;
  bpom_number: string;
  generic_name: string;
  content: string;
  description: string;
  classification: string;
  packaging: string;
  selling_unit: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  image_url: string;
  thumbnail_url: string;
  is_active: boolean;
  is_prescription_required: boolean;
  min_price: number;
  max_price: number;
  size: string;
  sales?: number;
};

export type CategoryType = {
  id: number;
  name: string;
  category_slug: string;
  image_url: string;
  has_child: boolean;
  category_level: number;
  children: [];
};

export interface IResponseGetAllProduct {
  message: string;
  pagination: IPaginationProduct;
  data: IDataProduct[];
}

export interface IResponseGetAllManufacture {
  message: string;
  pagination: IPaginationManufacture;
  data: IDataManufacture[];
}

export interface IDataManufacture {
  id: number;
  manufacturer_name: string;
}

export interface IResponseGetDetailProduct {
  message: string;
  data: IDataDetailOneProduct;
}

export interface IDataDetailOneProduct {
  id: number;
  name: string;
  min_price: number;
  max_price: number;
  product_slug: string;
  generic_name: string;
  general_indication: string;
  how_to_use: string;
  side_effects: string;
  contraindication: string;
  warning: string;
  bpom_number: string;
  content: string;
  description: string;
  classification: string;
  packaging: string;
  selling_unit: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  dosage: string;
  image_url: string;
  thumbnail_url: string;
  is_active: boolean;
  is_prescription_required: boolean;
  manufacturer: IManufacturer;
  categories: ICategories[];
  sales: ISales[];
}

export interface IPaginationProduct {
  page: number;
  page_count: number;
  total_records: number;
  limit: number;
}

export interface IPaginationManufacture {
  page: number;
  page_count: number;
  total_records: number;
  limit: number;
}

export interface IDataProduct {
  id: number;
  name: string;
  product_slug: string;
  selling_unit: string;
  min_price: number;
  max_price: number;
  image_url: string;
  sales: number;
}

export interface IManufacturer {
  id: number;
  name: string;
}

export interface ICategories {
  id: number;
  name: string;
}

export interface ISales {
  month: string;
  total_sales: string;
}

export interface IGetProductsParam extends PaginationParamsItf {
  search?: string | null;
  category?: number | null;
}

export type INullableProduct = {
  id?: number;
  name?: string;
  product_slug?: string;
  selling_unit?: string;
  min_price?: number;
  max_price?: number;
  image_url?: string;
  sales?: number;
};
