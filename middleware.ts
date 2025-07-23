import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    // Contoh: generate sessionCartId jika belum ada
    if (!req.cookies.get("sessionCartId")) {
      const response = NextResponse.next();
      response.cookies.set("sessionCartId", crypto.randomUUID());
      return response;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }: { token: any; req: NextRequest }) => {
        const protectedPaths = [
          /\/shipping-address/,
          /\/payment-method/,
          /\/place-order/,
          /\/profile/,
          /\/user\/(.*)/,
          /\/order\/(.*)/,
          /\/admin/,
        ];

        const { pathname } = req.nextUrl;
        if (!token && protectedPaths.some((r) => r.test(pathname))) {
          return false;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/shipping-address",
    "/payment-method",
    "/place-order",
    "/profile",
    "/user/:path*",
    "/order/:path*",
    "/admin/:path*",
  ],
};
