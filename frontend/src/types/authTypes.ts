export type Gender = 'laki-laki' | 'perempuan';
export type Role = 'user' | 'doctor' | 'partner' | 'admin';

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
  specialization?: string | undefined | null;
}
