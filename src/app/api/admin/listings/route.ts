import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth, errorResponse, successResponse } from '@/lib/api-utils';

// GET /api/admin/listings
export const GET = withAuth(async (req) => {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    let query = 'SELECT * FROM listings WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (title LIKE ? OR employer LIKE ? OR country LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    return successResponse(rows);
  } catch (error) {
    console.error('List listings error:', error);
    return errorResponse('Failed to fetch listings', 500);
  }
});

// POST /api/admin/listings
export const POST = withAuth(async (req, admin) => {
  try {
    const body = await req.json();
    const { title, type, country, employer, description, requirements, benefits, status } = body;

    if (!title || !type || !country) {
      return errorResponse('Title, type, and country are required', 400);
    }

    const [result] = await pool.execute(
      'INSERT INTO listings (title, type, country, employer, description, requirements, benefits, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, type, country, employer || null, description || '', requirements || '', benefits || '', status || 'active', admin.id]
    );

    return successResponse({ id: (result as any).insertId, message: 'Listing created' }, 201);
  } catch (error) {
    console.error('Create listing error:', error);
    return errorResponse('Failed to create listing', 500);
  }
});
