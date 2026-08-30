import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

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
  return db.verifyToken(token);
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
