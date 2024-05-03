export type Gender = 'laki-laki' | 'perempuan';
export type Role = 'user' | 'doctor' | 'partner' | 'admin';

export interface ProvinceApiItf {
  id: number | null;
  name: string | null;
}

export interface CityApiItf {
  id: number | null;
  name: string | null;
  postal_code: string | null;
  type: string | null;
  province: ProvinceApiItf;
}

export interface AddressApiItf {
  id: number | null;
  alias: string | null;
  city: CityApiItf;
  detail: string | null;
  longitude: string | null;
  latitude: string | null;
}

export interface AuthReduxItf {
  aid: number;
  email: string;
  name: string;
  gender: Gender;
  birthDate: Date | undefined;
  role: Role;
  isVerified: boolean;
  isApproved: boolean;
  avatarUrl: string;
  activeAddressId?: number | null;
  addresses?: Array<AddressApiItf>;
}

export interface AuthDoctorReduxItf {
  aid: number;
  email: string;
  name: string;
  role: Role;
  isVerified: boolean;
  isApproved: boolean;
  avatarUrl: string;
  specialization: string;
  isOnline: boolean;
  experiences: number;
  certificate: string;
  fee: number;
  openingTime: string;
  operationalHours: string;
  operationalDays: Array<string>;
}

export interface RajaOngkirProvinceItf {
  province_id: string;
  province: string;
}

export interface ObatinProvinceItf {
  province_id: string;
  province_name: string;
}

export interface ProvincesItf {
  provinces: Array<ObatinProvinceItf>;
}
