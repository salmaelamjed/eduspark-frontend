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

  // 1. Protéger les routes privées → rediriger vers login si pas de token
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
    // ← CHANGEMENT ICI : rediriger vers /dashboard au lieu de /
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Tout OK
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|public/).*)"],
};
