import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const SECRET = process.env.HMAC_SECRET || 'secret-key';

export function newParticipantId(): string {
  return uuidv4();
}

export function signParticipant(id: string): string {
  const hmac = crypto.createHmac('sha256', SECRET).update(id).digest('hex');
  return `${id}.${hmac}`;
}

export function verifyParticipant(token: string | undefined): string | null {
  if (!token) return null;
  const [id, sig] = token.split('.');
  const hmac = crypto.createHmac('sha256', SECRET).update(id).digest('hex');
  return sig === hmac ? id : null;
}
