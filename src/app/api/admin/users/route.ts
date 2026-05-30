import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { withAuth, errorResponse, successResponse } from '@/lib/api-utils';

// GET /api/admin/users
export const GET = withAuth(async (req) => {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    let query = 'SELECT id, email, name, phone, country, email_verified, status, created_at FROM users WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return successResponse(rows);
  } catch (error) {
    console.error('List users error:', error);
    return errorResponse('Failed to fetch users', 500);
  }
});

// PATCH /api/admin/users - Update user status/verification
export const PATCH = withAuth(async (req) => {
  try {
    const body = await req.json();
    const { userId, status, email_verified } = body;

    if (!userId) {
      return errorResponse('User ID is required', 400);
    }

    if (status) {
      await pool.execute('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
    }
    if (email_verified !== undefined) {
      await pool.execute('UPDATE users SET email_verified = ? WHERE id = ?', [email_verified, userId]);
    }

    return successResponse({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    return errorResponse('Failed to update user', 500);
  }
});
