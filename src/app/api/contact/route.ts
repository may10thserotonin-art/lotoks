import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, email, phone, service, message } = parsed.data;

    // In production, send email here
    console.log('Contact form submission:', { name, email, phone, service, message });

    return NextResponse.json({
      message: 'Thank you for your message! We will get back to you within 24 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
