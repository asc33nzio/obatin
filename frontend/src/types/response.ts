import { PaginationInfoItf } from './transactionTypes';

export interface APIResponseItf<T> {
  message: string;
  pagination?: PaginationInfoItf;
  data?: T;
}
