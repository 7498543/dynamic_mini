import jwt from 'jsonwebtoken';
import { H3Event } from '#imports';

const SECRET = process.env.JWT_SECRET!;

export interface AuthUser {
  id: number;
  role: string;
}

export function requireAuth(
  event: H3Event,
  permission?: string[]
): AuthUser | null {
  try {
    const user = verifyAccessToken(event);

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }
    let role = Array.isArray(user.role)
      ? user.role
      : user.role.split(',') || [user.role || ''];
    for (let r of role) {
      if (permission && !permission.includes(r)) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
      }
    }
    return user;
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
}

export function verifyAccessToken(event: H3Event) {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '');

  try {
    return jwt.verify(token, SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export function generateNewAccessToken(user: AuthUser) {
  return jwt.sign(user, SECRET, { expiresIn: '1h' });
}
