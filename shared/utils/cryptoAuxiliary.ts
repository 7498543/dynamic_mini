import crypto from 'crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto
    .pbkdf2Sync(password, salt as string, 1000, 64, 'sha512')
    .toString('hex');
  return hash === verifyHash;
}

export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export function randomUUID(): string {
  return crypto.randomUUID();
}

export function ensureKeyLength(key: string): Buffer {
  return Buffer.from(key.padEnd(32, '0').slice(0, 32));
}

export function ensureIVLength(iv: string): Buffer {
  return Buffer.from(iv.padEnd(16, '0').slice(0, 16));
}

export interface EncryptOptions extends Record<string, any> {
  secret: string;
  iv: string;
}
export function encryptValue<T = any>(
  value: T,
  encryptOpt: EncryptOptions
): string {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    ensureKeyLength(encryptOpt.secret),
    ensureIVLength(encryptOpt.iv)
  );

  let valueStr = typeof value === 'string' ? value : JSON.stringify(value);

  const encryptedHex =
    cipher.update(valueStr).toString('hex') + cipher.final('hex');
  return Buffer.from(encryptedHex, 'hex').toString('base64');
}

export function decryptValue<T = any>(
  value: string,
  encryptOpt: EncryptOptions
): T {
  const encryptedHex = Buffer.from(value, 'base64').toString('hex');
  // 创建解密器
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    ensureKeyLength(encryptOpt.secret),
    ensureIVLength(encryptOpt.iv)
  );
  // 解密数据
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  try {
    return JSON.parse(decrypted);
  } catch (error) {
    return decrypted as T;
  }
}
