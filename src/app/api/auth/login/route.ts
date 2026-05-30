import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const [rows] = await pool.execute(
      'SELECT id, email, password_hash, name, role, status FROM admins WHERE email = ?',
      [email]
    );
    const admins = rows as any[];
    if (admins.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const admin = admins[0];
    if (admin.status === 'inactive') {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
    }

    const valid = await comparePassword(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
