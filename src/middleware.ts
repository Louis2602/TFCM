import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/sign-in", "/sign-up", "/"];

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("tfcm-auth-cookie");

  const requestedPath = new URL(request.url).pathname;

  if (!authCookie?.value && !publicRoutes.includes(requestedPath)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};