import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "honghong-simulator-secret-key-2024";
const COOKIE_NAME = "auth_token";

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/register", "/api/auth", "/blog", "/leaderboard", "/api/blog", "/api/leaderboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    // Redirect to login for page requests
    if (!pathname.startsWith("/api/")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Return 401 for API requests
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  // Verify token
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.next();
  } catch {
    // Invalid token, clear cookie and redirect
    if (!pathname.startsWith("/api/")) {
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
    const response = NextResponse.json({ error: "登录已过期" }, { status: 401 });
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - blog pages (public)
     */
    "/((?!_next/static|_next/image|favicon.ico|blog).*)",
  ],
};
