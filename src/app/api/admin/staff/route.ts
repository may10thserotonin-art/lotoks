import { NextRequest } from 'next/server';
import pool from '@/lib/db';
import { withAuth, errorResponse, successResponse } from '@/lib/api-utils';
import { hashPassword } from '@/lib/auth';

// GET /api/admin/staff
export const GET = withAuth(async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, name, role, status, created_at FROM admins ORDER BY created_at DESC'
    );
    return successResponse(rows);
  } catch (error) {
    console.error('List staff error:', error);
    return errorResponse('Failed to fetch staff', 500);
  }
});

// POST /api/admin/staff - Create new staff
export const POST = withAuth(async (req, admin) => {
  try {
    if (admin.role !== 'super_admin') {
      return errorResponse('Only super admins can create staff', 403);
    }

    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    // Check if email already exists
    const [existing] = await pool.execute('SELECT id FROM admins WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return errorResponse('Email already registered', 409);
    }

    const passwordHash = await hashPassword(password);

    await pool.execute(
      'INSERT INTO admins (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      [email, passwordHash, name || email.split('@')[0], role || 'reviewer']
    );

    return successResponse({ message: 'Staff created successfully' }, 201);
  } catch (error) {
    console.error('Create staff error:', error);
    return errorResponse('Failed to create staff', 500);
  }
});

// DELETE /api/admin/staff
export const DELETE = withAuth(async (req, admin) => {
  try {
    if (admin.role !== 'super_admin') {
      return errorResponse('Only super admins can delete staff', 403);
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return errorResponse('Staff ID is required', 400);
    }

    // Don't allow deleting yourself
    if (Number(id) === admin.id) {
      return errorResponse('Cannot delete your own account', 400);
    }

    await pool.execute('DELETE FROM admins WHERE id = ?', [id]);
    return successResponse({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    return errorResponse('Failed to delete staff', 500);
  }
});
