import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { withAuth, errorResponse, successResponse } from '@/lib/api-utils';

// GET /api/admin/payments
export const GET = withAuth(async (req) => {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const method = url.searchParams.get('method');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    const format = url.searchParams.get('format');

    let query = 'SELECT * FROM payments WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (method) {
      query += ' AND method = ?';
      params.push(method);
    }
    if (from) {
      query += ' AND created_at >= ?';
      params.push(from);
    }
    if (to) {
      query += ' AND created_at <= ?';
      params.push(to);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.execute(query, params);
    const payments = rows as any[];

    // CSV export
    if (format === 'csv') {
      const headers = 'ID,Amount,Currency,Method,Status,Transaction Ref,Created At\n';
      const csv = headers + payments
        .map((p: any) => `${p.id},${p.amount},${p.currency},${p.method},${p.status},${p.transaction_ref || ''},${p.created_at}`)
        .join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=payments.csv',
        },
      });
    }

    return successResponse(payments);
  } catch (error) {
    console.error('List payments error:', error);
    return errorResponse('Failed to fetch payments', 500);
  }
});
