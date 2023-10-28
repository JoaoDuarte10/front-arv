import * as crypto from 'crypto';

export function randomId(): string {
  return crypto.randomBytes(20).toString('hex');
}
