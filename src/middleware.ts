import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing, locales, defaultLocale } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Routes requiring authentication
const protectedPathPatterns = [
  /\/account(\/.*)?$/,
  /\/attempts(\/.*)?$/,
  /\/assessment(\/.*)?$/,
  /\/checkout(\/.*)?$/,
  /\/reports(\/.*)?$/,
  /\/admin(\/.*)?$/,
];

// Auth routes where already logged-in users shouldn't linger
const authPathPatterns = [
  /\/login$/,
  /\/register$/,
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from path if present, otherwise default
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = locales.includes(segments[0] as any) ? segments[0] : defaultLocale;

  // Check auth tokens in httpOnly cookies set by backend
  const hasAuth = Boolean(
    request.cookies.get('accessToken')?.value ||
    request.cookies.get('refreshToken')?.value
  );

  const pathWithoutLocale = segments.length > 0 && locales.includes(segments[0] as any)
    ? `/${segments.slice(1).join('/')}`
    : pathname;

  const isProtected = protectedPathPatterns.some((pattern) => pattern.test(pathWithoutLocale));
  const isAuthRoute = authPathPatterns.some((pattern) => pattern.test(pathWithoutLocale));

  // 1. Unauthenticated access to protected route -> redirect to login with reason & return URL
  if (isProtected && !hasAuth) {
    const loginUrl = new URL(`/${currentLocale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    if (pathname.includes('/assessment') || pathname.includes('/checkout')) {
      loginUrl.searchParams.set('reason', 'purchase_required');
    } else {
      loginUrl.searchParams.set('reason', 'auth_required');
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated access to login/register -> redirect to homepage
  if (isAuthRoute && hasAuth) {
    const homeUrl = new URL(`/${currentLocale}`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Delegate to next-intl routing middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames, skipping api, _next, favicon, and static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
