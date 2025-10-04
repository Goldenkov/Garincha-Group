const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const getCrypto = (): Crypto => {
  const cryptoObj = (globalThis as any)?.crypto as Crypto | undefined;

  if (!cryptoObj) {
    throw new Error('Web Crypto API недоступен в данном окружении.');
  }

  return cryptoObj;
};

const base32ToBytes = (input: string): Uint8Array => {
  const cleaned = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';

  for (const char of cleaned) {
    const value = BASE32_ALPHABET.indexOf(char);

    if (value === -1) {
      throw new Error(`Недопустимый символ base32: ${char}`);
    }

    bits += value.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];

  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  return new Uint8Array(bytes);
};

const counterToBuffer = (counter: number): ArrayBuffer => {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  const high = Math.floor(counter / 0x100000000);
  const low = counter % 0x100000000;

  view.setUint32(0, high);
  view.setUint32(4, low);

  return buffer;
};

const generateHmac = async (secret: string, counter: number): Promise<Uint8Array> => {
  const cryptoObj = getCrypto();
  const keyBytes = base32ToBytes(secret);
  const key = await cryptoObj.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const buffer = counterToBuffer(counter);
  const signature = await cryptoObj.subtle.sign('HMAC', key, buffer);

  return new Uint8Array(signature);
};

const hotp = async (secret: string, counter: number, digits = 6): Promise<string> => {
  const hmac = await generateHmac(secret, counter);
  const offset = hmac[hmac.length - 1] & 0xf;

  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % 10 ** digits;

  return otp.toString().padStart(digits, '0');
};

export const generateTwoFactorSecret = (length = 32): string => {
  const cryptoObj = getCrypto();
  const randomBytes = new Uint8Array(length);
  cryptoObj.getRandomValues(randomBytes);

  return Array.from(randomBytes)
    .map((value) => BASE32_ALPHABET[value % BASE32_ALPHABET.length])
    .join('');
};

export const createOtpAuthUrl = (
  secret: string,
  accountName: string,
  issuer: string,
  provider?: 'google' | 'yandex'
): string => {
  const labelAccount = provider === 'yandex' ? `${accountName} (Yandex)` : accountName;
  const label = `${issuer}:${labelAccount}`;
  const encodedLabel = encodeURIComponent(label);
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedSecret = encodeURIComponent(secret.replace(/\s+/g, ''));

  return `otpauth://totp/${encodedLabel}?secret=${encodedSecret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
};

export const verifyTotpToken = async (
  token: string,
  secret: string,
  options: { window?: number; step?: number; digits?: number } = {}
): Promise<boolean> => {
  const { window = 1, step = 30, digits = 6 } = options;
  const sanitizedToken = token.replace(/\s+/g, '');

  if (!new RegExp(`^\\d{${digits}}$`).test(sanitizedToken)) {
    return false;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const counter = Math.floor(timestamp / step);

  for (let offset = -window; offset <= window; offset += 1) {
    const currentCounter = counter + offset;

    if (currentCounter < 0) {
      continue;
    }

    const expected = await hotp(secret, currentCounter, digits);

    if (expected === sanitizedToken) {
      return true;
    }
  }

  return false;
};
