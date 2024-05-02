import { NextRequest, NextResponse } from 'next/server';

interface Cookies {
  id?: string;
  password?: string;
}

export function authenticate(req: NextRequest) {
  const cookies: Cookies = req.cookies;

  if (cookies && cookies.id !== 'webskitters' || cookies.password !== 'webskitters') {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}
