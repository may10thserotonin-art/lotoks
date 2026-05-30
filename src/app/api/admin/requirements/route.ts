import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth } from '@/lib/api-utils';
import { errorResponse, successResponse } from '@/lib/api-utils';

// GET /api/admin/requirements - List all requirement sets
export const GET = withAuth(async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT rs.*, a.name as updated_by_name FROM requirement_sets rs LEFT JOIN admins a ON rs.updated_by = a.id ORDER BY rs.service_type'
    );
    return successResponse(rows);
  } catch (error) {
    console.error('Admin requirements list error:', error);
    return errorResponse('Failed to fetch requirement sets', 500);
  }
});
