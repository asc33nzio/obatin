interface decodedSessionTokenPayloadItf {
  aid: number;
  role: string;
  random_token: string;
}

interface decodedSessionTokenRegisteredClaimsItf {
  iss: string;
  exp: number;
  iat: number;
}

export interface DecodedJwtItf {
  Payload: decodedSessionTokenPayloadItf;
  RegisteredClaims: decodedSessionTokenRegisteredClaimsItf;
}

export interface StandardDecodedJwtItf {
  header: decodedSessionTokenPayloadItf | null;
  payload: DecodedJwtItf | null;
}
