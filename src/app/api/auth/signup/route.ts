import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, getCurrentAdmin, signToken, setAuthCookie } from '@/lib/auth';
import { signupSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    // Only super_admin can create new admins
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password, role } = parsed.data;

    // Check if email already exists
    const [existing] = await pool.execute('SELECT id FROM admins WHERE email = ?', [email]);
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    await pool.execute(
      'INSERT INTO admins (email, password_hash, role, name) VALUES (?, ?, ?, ?)',
      [email, passwordHash, role, email.split('@')[0]]
    );

    return NextResponse.json({ message: 'Admin created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
