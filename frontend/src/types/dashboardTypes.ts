import { Gender } from './reduxTypes';

export interface EditProfileStateItf {
  email: boolean;
  name: boolean;
  password: boolean;
  confirmPassword: boolean;
  gender: boolean;
  birthDate: boolean;
  avatar: boolean;
}

export interface EditProfileDoctorStateItf {
  email: boolean;
  name: boolean;
  password: boolean;
  confirmPassword: boolean;
  avatar: boolean;
  experiences: boolean;
  time: boolean;
  operationalDays: boolean;
  fee: boolean;
}

export interface EditProfilePayloadItf {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
  gender?: Gender;
  birthDate?: Date;
  avatar?: Blob;
  experiences?: number;
}

export interface GenderItf {
  isMale: boolean;
}

type TimeValueType = Date | string | null;
export type TimeValue = TimeValueType | [TimeValueType, TimeValueType];
