import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicOnlyRoutes = [
  "/sign-in",
  "/login",
  "/sign-up",
  "/register",
  "/mot-de-passe-oublie",
  "/forgot-password",
  "/verification-email",
  "/verify-email",
];

const protectedRoutesPatterns = ["/dashboard", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const authUserCookie = request.cookies.get("auth_user")?.value;

  let userRole: string | null = null;

  if (authUserCookie) {
    try {
      const decoded = decodeURIComponent(authUserCookie);
      const user = JSON.parse(decoded);
      userRole = user?.role || user?.Role;
    } catch (error) {
      console.error("Failed to parse auth_user cookie:", error);
    }
  }
  // 1. Routes protégées (besoin d'être connecté)
  const isProtected = protectedRoutesPatterns.some(
    (pattern) => pathname === pattern || pathname.startsWith(pattern),
  );
 

  if (isProtected && !token) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Utilisateur CONNECTÉ sur une page publique-only (login, register, etc.)
  // → rediriger vers /dashboard (pas vers /)
 const isPublicOnly = publicOnlyRoutes.some(
   (route) => pathname === route || pathname.startsWith(route),
 );

 if (isPublicOnly && token) {
   return NextResponse.redirect(new URL("/dashboard", request.url));
 }

if (token && userRole) {
  const restrictedRoles = ["admin", "teacher"];

  if (restrictedRoles.includes(userRole.toLowerCase())) {
    const isRestrictedPublic =
      pathname === "/" ||
      publicOnlyRoutes.some(
        (route) => pathname === route || pathname.startsWith(route),
      );

    if (isRestrictedPublic) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
}



  // Tout OK
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|public/).*)"],
};
