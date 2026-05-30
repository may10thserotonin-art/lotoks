import { NextRequest, NextResponse } from 'next/server';

export default function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|api/|images/|videos/|favicon.ico|logo.png).*)'],
};
