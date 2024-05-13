import { PaginationParamsItf } from './request';

export interface GetPharmaciesParams extends PaginationParamsItf {
  search?: string | null;
  city?: string | null;
  partner_id?: string | null;
}

export type PharmacyType = {
  id?: number;
  name?: string;
  address?: number;
  city_id?: number;
  city?: string;
  lat?: string;
  lng?: string;
  pharmacist_name?: string;
  pharmacist_license?: string;
  pharmacist_phone?: string;
  opening_time?: string;
  closing_time?: string;
  operational_days?: string[];
  partner_id?: number;
};
