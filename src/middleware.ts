import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, AUTH_COOKIE_NAME } from "@/lib/auth";

// Girişe gerek olmayan tek admin sayfası: login ekranı.
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((p) =>
    pathname.startsWith(p)
  );
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifyAdminToken(token) : null;

  if (isAdminPath && !isPublicAdminPath && !session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Zaten giriş yapmış bir admin login sayfasına giderse dashboard'a yönlendir.
  if (pathname === "/admin/login" && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
