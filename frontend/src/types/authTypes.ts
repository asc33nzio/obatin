export type Gender = 'male' | 'female' | undefined;
export type Role = 'user' | 'doctor' | 'partner' | 'admin';

export interface AuthReduxItf {
  email: string;
  name: string;
  gender: Gender | undefined;
  birthDate: Date | undefined;
  specialization: string | undefined | null;
  role: Role;
  isVerified: boolean;
  isApproved: boolean;
}
