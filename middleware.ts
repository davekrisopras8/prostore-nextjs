import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
  runtime: "nodejs",
};
