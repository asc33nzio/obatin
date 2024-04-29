import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
// eslint-disable-next-line
import { DecodedJwtItf, StandardDecodedJwtItf } from './types/jwtTypes';
// eslint-disable-next-line
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { decodeJWT } from './utils/decodeJWT';

const protectedRoutes = ['/dashboard/user', 'dashboard/doctor'];
const publicRoutes = ['/', '/auth/login', '/auth/register', '/shop'];

export const config = {
  matcher: ['/:path*'],
};

export default async function middleware(request: NextRequest) {
  const redirectToLogin = new URL(
    '/auth/login',
    request.nextUrl.href,
  ).toString();

  if (request.nextUrl.pathname.startsWith('/auth')) {
    const restrictedPaths = ['/auth', '/auth/'];

    if (restrictedPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(redirectToLogin);
    }
  }

  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  // eslint-disable-next-line
  const isPublicRoute = publicRoutes.includes(path);

  const access_cookie = await cookies().get('access_token')?.value;
  console.log('ACCESS', access_cookie);
  if (isProtectedRoute && access_cookie === undefined) {
    return NextResponse.redirect(redirectToLogin);
  } else {
    // eslint-disable-next-line
    const userSessionCredentials: StandardDecodedJwtItf =
      await decodeJWT(access_cookie);

    console.log(userSessionCredentials);
    const authId = userSessionCredentials?.payload?.Payload?.aid;
    const userRole = userSessionCredentials?.payload?.Payload?.role;

    console.log(authId);
    console.log(userRole);
  }

  // setUserRole(decoded.Payload.role);

  // if (request.nextUrl.pathname.startsWith('/dashboard')) {
  //   let access_token = request.cookies.get('access_token');
  //   console.log('access', access_token);
  //   let session_token = request.cookies.get('session_token');
  //   console.log('session', session_token);
  // }

  // request.cookies.has('access_token');
  // request.cookies.has('session_token');

  const response = NextResponse.next();
  //   response.cookies.set('vercel', 'fast');
  //   response.cookies.set({
  //     name: 'vercel',
  //     value: 'fast',
  //     path: '/',
  //   });

  return response;
}
