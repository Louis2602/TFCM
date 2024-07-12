import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/sign-in", "/sign-up", "/"];

// Function to check if the path is a public route
function isPublicRoute(pathname: string) {
  // Check for static public routes
  if (publicRoutes.includes(pathname)) {
    return true;
  }

  // Check if the path starts with "/share/"
  console.log(pathname)
  return pathname.startsWith("/share/") || pathname.startsWith("/api/share/");
}

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("tfcm-auth-cookie");

  const requestedPath = new URL(request.url).pathname;

  if (!authCookie?.value && !isPublicRoute(requestedPath)) {
    console.log(isPublicRoute(requestedPath));
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
