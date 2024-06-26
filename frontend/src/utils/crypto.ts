const secret_key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export async function encrypt(plaintext: string) {
  if (secret_key === undefined) throw new Error('Please define encryption key');
  const pwUtf8 = new TextEncoder().encode(secret_key);
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ivStr = Array.from(iv)
    .map((b) => String.fromCharCode(b))
    .join('');

  const alg = { name: 'AES-GCM', iv: iv };

  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, [
    'encrypt',
  ]);

  const ptUint8 = new TextEncoder().encode(plaintext);
  const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8);

  const ctArray = Array.from(new Uint8Array(ctBuffer));
  const ctStr = ctArray.map((byte) => String.fromCharCode(byte)).join('');

  return btoa(ivStr + ctStr);
}

export async function decrypt(ciphertext: string) {
  if (secret_key === undefined) throw new Error('Please define encryption key');
  const pwUtf8 = new TextEncoder().encode(secret_key);
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);

  const ivStr = atob(ciphertext).slice(0, 12);
  const iv = new Uint8Array(Array.from(ivStr).map((ch) => ch.charCodeAt(0)));

  const alg = { name: 'AES-GCM', iv: iv };
  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, [
    'decrypt',
  ]);

  const ctStr = atob(ciphertext).slice(12);
  const ctUint8 = new Uint8Array(
    Array.from(ctStr).map((ch) => ch.charCodeAt(0)),
  );

  try {
    const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8);
    const plaintext = new TextDecoder().decode(plainBuffer);
    return plaintext;
  } catch (e: any) {
    throw new Error(e);
  }
}
