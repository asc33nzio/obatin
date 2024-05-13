import { PaginationParamsItf } from './request';

export interface GetPartnersParams extends PaginationParamsItf {
  search?: string | null;
}

export type PartnerType = {
  id?: number;
  name?: string;
  logo_url?: string;
};
