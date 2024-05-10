import { IChatRoom } from './chatRoomItf';

export interface OneItemPrescriptionItf {
  product_id: number;
  amount: number | undefined;
}

export interface IPayloadCreatePrescription {
  user_id: number;
  items: OneItemPrescriptionItf[];
}

export interface IPagination {
  page: number;
  page_count: number;
  total_records: number;
  limit: number;
}

export interface IGetAllChatRoom {
  message: string;
  pagination: IPagination;
  data: IChatRoom[];
}

export interface IDataResponseCreatePrescription {
  id: number;
}

export interface IResponseCreatePrescription {
  message: string;
  data: IDataResponseCreatePrescription;
}

export interface IAxiosResponseCreatePrescription {
  data: IResponseCreatePrescription;
}

export interface IOneDrugDetailPrescription {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_image_url: string;
  product_thumbnail_url: string;
  product_classification: string;
  product_selling_unit: string;
  quantity: number;
}
export interface IDetailPrescriptionData {
  PrescriptionId: number;
  doctor_id: number;
  doctor_name: string;
  doctor_specializaiton_id: number;
  doctor_specialization: string;
  is_doctor_online: boolean;
  user_id: number;
  user_name: string;
  user_birth_date: string;
  user_gender: string;
  created_at: string;
  items: IOneDrugDetailPrescription[];
}

export interface IResponseOneDetailPrescription {
  message: string;
  data: IDetailPrescriptionData;
}

export interface IPayloadBulkAddCartFromPrescription {
  cart: ICartPayloadBulkAddCartFromPrescription[];
}

export interface ICartPayloadBulkAddCartFromPrescription {
  product_id: number;
  prescription_id: number;
  pharmacy_id?: number;
  quantity: number;
}
