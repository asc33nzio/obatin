import { Gender } from '@/types/authTypes';

// export type datePickerData = Date | null;
// export type DatePickerType = datePickerData | [datePickerData, datePickerData];

export interface EditProfileStateItf {
  email: boolean;
  name: boolean;
  password: boolean;
  confirmPassword: boolean;
  gender: boolean;
  birthDate: boolean;
  avatar: boolean;
}

export interface EditProfilePayloadItf {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
  gender?: Gender;
  birthDate?: Date;
  avatar?: Blob;
}

export interface GenderItf {
  isMale: boolean;
}
