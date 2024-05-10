export type UserRoles = 'user' | 'doctor' | 'manager' | 'admin';

interface decodedAccessTokenPayloadItf {
  aid: number;
  role: UserRoles;
  is_verified: boolean;
  is_approved: boolean;
  random_token?: string;
}

interface decodedAccessTokenRegisteredClaimsItf {
  iss: string;
  exp: number;
  iat: number;
}

export interface DecodedJwtItf {
  Payload: decodedAccessTokenPayloadItf;
  RegisteredClaims: decodedAccessTokenRegisteredClaimsItf;
}

export interface StandardDecodedJwtItf {
  header: decodedAccessTokenPayloadItf | null;
  payload: DecodedJwtItf | null;
}
