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

const protectedRoutes = [
  "/dashboard",
  "/dashboard/:path*", 
  "/profile",
  "/profile/:path*",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth_token")?.value;

  // 1. Utilisateur NON connecté → essaie d'accéder à une page protégée ?
  const isProtected = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(route.replace(/:\w+\*?$/, "")),
  );

  if (isProtected && !token) {
    // Rediriger vers login + garder l'URL d'origine (pour redirect après login)
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Utilisateur CONNECTÉ → essaie d'accéder à sign-in / sign-up / etc. ?
  const isPublicOnly = publicOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(route),
  );

  if (isPublicOnly && token) {
    // Rediriger vers dashboard (ou page d'accueil connectée)
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Tout est OK → continuer
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|public/).*)",
  ],
};
