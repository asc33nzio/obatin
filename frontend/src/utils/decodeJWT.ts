import { StandardDecodedJwtItf } from '@/types/jwtTypes';

export const decodeJWT = async (
  token: string | undefined,
): Promise<StandardDecodedJwtItf> => {
  if (token === undefined) {
    return {
      header: null,
      payload: null,
    };
  }

  const [headerEncoded, payloadEncoded] = token.split('.');
  const header = JSON.parse(atob(headerEncoded));
  const payload = JSON.parse(atob(payloadEncoded));

  return {
    header,
    payload,
  };
};

export const decodeJWTSync = (
  token: string | undefined,
): StandardDecodedJwtItf => {
  if (token === undefined) {
    return {
      header: null,
      payload: null,
    };
  }

  const [headerEncoded, payloadEncoded] = token.split('.');
  const header = JSON.parse(atob(headerEncoded));
  const payload = JSON.parse(atob(payloadEncoded));

  return {
    header,
    payload,
  };
};
