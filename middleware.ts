import { auth } from './auth'; // dari konfigurasi NextAuth kamu
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const session = await auth(); // ambil session dari next-auth

  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ];

  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((regex) => regex.test(pathname));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // sessionCartId check
  if (!request.cookies.get('sessionCartId')) {
    const sessionCartId = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set('sessionCartId', sessionCartId);
    return response;
  }

  return NextResponse.next();
}
