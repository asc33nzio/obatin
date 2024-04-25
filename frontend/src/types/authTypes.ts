export type Gender = 'laki-laki' | 'perempuan';
export type Role = 'user' | 'doctor' | 'partner' | 'admin';

export interface AuthReduxItf {
  email: string;
  name: string;
  gender: Gender;
  birthDate: Date | undefined;
  specialization: string | undefined | null;
  role: Role;
  isVerified: boolean;
  isApproved: boolean;
}
