import { NextResponse } from 'next/server';
import { getCurrentAdmin, AdminPayload } from './auth';

export type RouteHandler = (
  req: Request,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

export type AuthedHandler = (
  req: Request,
  admin: AdminPayload,
  context: { params: Promise<Record<string, string>> }
) => Promise<NextResponse>;

// Require authentication
export function withAuth(handler: AuthedHandler): RouteHandler {
  return async (req, context) => {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return handler(req, admin, context);
  };
}

// Require authentication + specific role(s)
export function withRole(
  allowedRoles: AdminPayload['role'][],
  handler: AuthedHandler
): RouteHandler {
  return withAuth(async (req, admin, context) => {
    if (!allowedRoles.includes(admin.role)) {
      return NextResponse.json(
        { error: 'Forbidden: insufficient permissions' },
        { status: 403 }
      );
    }
    return handler(req, admin, context);
  });
}

// Success response helper
export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

// Error response helper
export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
