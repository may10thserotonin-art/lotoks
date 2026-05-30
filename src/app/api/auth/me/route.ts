import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [rows] = await pool.execute(
      'SELECT id, email, name, role, status, created_at FROM admins WHERE id = ?',
      [admin.id]
    );
    const admins = rows as any[];
    if (admins.length === 0) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ admin: admins[0] });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
