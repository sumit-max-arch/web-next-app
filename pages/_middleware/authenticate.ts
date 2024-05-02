import { NextRequest, NextResponse } from 'next/server';

interface Cookies {
  id?: string;
  password?: string;
}

export function authenticate(req: NextRequest) {
  const cookies: Cookies = req.cookies as Cookies; // Asserting req.cookies to be of type Cookies

  if (!cookies || cookies.id !== 'webskitters' || cookies.password !== 'webskitters') {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}
