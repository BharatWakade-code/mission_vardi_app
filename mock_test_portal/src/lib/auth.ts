import { NextRequest, NextResponse } from 'next/server';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export function getAuthUser(req: NextRequest): AuthenticatedUser | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    return {
      id: payload.user_id || payload.id || 'user-student-1',
      email: payload.email || '',
      role: payload.role || 'student',
    };
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest): AuthenticatedUser {
  const user = getAuthUser(req);
  if (!user) {
    throw { status: 401, error: 'Authentication required. Please sign in.' };
  }
  return user;
}

export function requireAdmin(req: NextRequest): AuthenticatedUser {
  const user = requireAuth(req);
  if (user.role !== 'admin') {
    throw { status: 403, error: 'Forbidden: Admin access required.' };
  }
  return user;
}

export function jsonError(message: string, status = 400, extra: Record<string, any> = {}) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function jsonSuccess(data: any, status = 200) {
  return NextResponse.json(data, { status });
}
