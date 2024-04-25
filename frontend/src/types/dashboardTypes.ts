export type datePickerData = Date | null;
export type DatePickerType = datePickerData | [datePickerData, datePickerData];

export interface EditProfileStateItf {
  email: boolean;
  name: boolean;
  password: boolean;
  confirmPassword: boolean;
  gender: boolean;
  birthDate: boolean;
}

export interface GenderItf {
  isMale: boolean;
}
