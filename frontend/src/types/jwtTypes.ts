interface decodedSessionTokenPayloadItf {
  role: string;
  uid: number;
}

interface decodedSessionTokenRegisteredClaimsItf {
  exp: number;
  iat: number;
  iss: string;
}

export interface DecodedJwtItf {
  Payload: decodedSessionTokenPayloadItf;
  RegisteredClaims: decodedSessionTokenRegisteredClaimsItf;
}
