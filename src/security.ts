import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
import type { Context } from '@midwayjs/koa';

type Account = {
  username: string;
  id: string;
  role: 'admin' | 'staff';
  salt: string;
  hash: string;
};
type Session = { id: string; role: string; expires: number };
const sessions = new Map<string, Session>();
const attempts = new Map<string, { count: number; started: number }>();
export function login(username: string, password: string, ip: string) {
  const now = Date.now();
  for (const [key, value] of attempts)
    if (now - value.started > 60000) attempts.delete(key);
  for (const [key, value] of sessions)
    if (value.expires <= now) sessions.delete(key);
  if (attempts.size > 10000 || sessions.size > 10000) return null;
  const attempt = attempts.get(ip) || { count: 0, started: now };
  attempts.set(ip, attempt);
  if (++attempt.count > 10) return null;
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    password.length > 1024
  )
    return null;
  try {
    const accounts = JSON.parse(
      readFileSync(process.env.APP_USERS_FILE || '', 'utf8')
    ) as Account[];
    const account = accounts.find((item) => item.username === username);
    if (!account || !['staff', 'admin'].includes(account.role)) return null;
    const expected = Buffer.from(account.hash, 'base64');
    const hash = pbkdf2Sync(
      password,
      Buffer.from(account.salt, 'base64'),
      310000,
      32,
      'sha256'
    );
    if (expected.length !== hash.length || !timingSafeEqual(expected, hash))
      return null;
    const token = randomBytes(32).toString('base64url');
    const session = {
      id: account.id,
      role: account.role,
      expires: now + 28800000,
    };
    sessions.set(token, session);
    return { token, id: session.id, role: session.role, expiresIn: 28800 };
  } catch {
    return null;
  }
}
export function session(ctx: Context): Session | null {
  const header = ctx.get('authorization');
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const value = sessions.get(token);
  if (!value || value.expires <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return value;
}
export function authorize(ctx: Context, admin = false) {
  const user = session(ctx);
  if (!user || (admin && user.role !== 'admin')) {
    ctx.status = user ? 403 : 401;
    return { success: false, message: user ? 'Forbidden' : 'Unauthorized' };
  }
  return null;
}
export function logout(ctx: Context) {
  sessions.delete(ctx.get('authorization').replace(/^Bearer /, ''));
}
