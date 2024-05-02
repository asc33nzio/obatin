import { NextRequest, NextResponse } from 'next/server';
import { StandardDecodedJwtItf } from './types/jwtTypes';
import { cookies } from 'next/headers';
import { decodeJWT } from './utils/decodeJWT';

//! Route group definitions
const publicRoutes = ['/', '/shop'];
const authRoutes = ['/auth/login', '/auth/register'];
const protectedRoutes = [
  '/dashboard/user',
  '/dashboard/user/transactions',
  '/dashboard/doctor',
];
const userOnlyRoutes = ['/dashboard/user', '/dashboard/user/transactions'];
const doctorOnlyRoutes = ['/dashboard/doctor'];

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  //! Redirect URL definitions
  // const redirectToHome = new URL('/', request.nextUrl.href).toString();

  const redirectToLogin = new URL(
    '/auth/login',
    request.nextUrl.href,
  ).toString();

  const redirectToUserDashboard = new URL(
    '/dashboard/user',
    request.nextUrl.href,
  ).toString();

  const redirectToDoctorDashboard = new URL(
    '/dashboard/doctor',
    request.nextUrl.href,
  ).toString();

  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  // eslint-disable-next-line
  const isPublicRoute = publicRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);
  const isUserOnlyRoute = userOnlyRoutes.includes(path);
  const isDoctorOnlyRoute = doctorOnlyRoutes.includes(path);

  //! Protected route guard clause
  const accessCookie = cookies().get('access_token')?.value;
  if (isProtectedRoute && accessCookie === undefined) {
    return NextResponse.redirect(redirectToLogin);
  }

  const userSessionCredentials: StandardDecodedJwtItf =
    await decodeJWT(accessCookie);
  // eslint-disable-next-line
  const authId = userSessionCredentials?.payload?.Payload?.aid;
  const userRole = userSessionCredentials?.payload?.Payload?.role;
  // eslint-disable-next-line
  const isVerified = userSessionCredentials?.payload?.Payload?.is_verified;
  // eslint-disable-next-line
  const isApproved = userSessionCredentials?.payload?.Payload?.is_approved;

  //! Restricted base routes
  if (request.nextUrl.pathname.startsWith('/auth')) {
    const restrictedPaths = ['/auth', '/auth/'];

    if (restrictedPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(redirectToLogin);
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const restrictedPaths = ['/dashboard', '/dashboard/'];

    if (restrictedPaths.includes(request.nextUrl.pathname)) {
      if (userRole === 'user') {
        return NextResponse.redirect(redirectToUserDashboard);
      }
      if (userRole === 'doctor') {
        return NextResponse.redirect(redirectToDoctorDashboard);
      }
      return NextResponse.redirect(redirectToLogin);
    }
  }

  //! Authorization based validations
  if (isAuthRoute && userRole === 'user') {
    return NextResponse.redirect(redirectToUserDashboard);
  }

  if (isAuthRoute && userRole === 'doctor') {
    return NextResponse.redirect(redirectToDoctorDashboard);
  }

  //! Role based validations
  if (isDoctorOnlyRoute && userRole === 'user') {
    return NextResponse.redirect(redirectToUserDashboard);
  }

  if (isUserOnlyRoute && userRole === 'doctor') {
    return NextResponse.redirect(redirectToDoctorDashboard);
  }

  return response;
}

export const config = {
  matcher: ['/:path*'],
};
