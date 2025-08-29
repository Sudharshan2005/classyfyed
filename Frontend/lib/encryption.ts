import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

const secret = process.env.ENCRYPTION_SECRET!;
const ivLength = 16;

export function encrypt(text: string): string {
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secret), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  const [ivHex, encryptedData] = text.split(':');
  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(secret),
    Buffer.from(ivHex, 'hex')
  );
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}