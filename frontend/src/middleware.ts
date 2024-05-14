import { NextRequest, NextResponse } from 'next/server';
import { StandardDecodedJwtItf } from './types/jwtTypes';
import { cookies } from 'next/headers';
import { decodeJWT } from './utils/decodeJWT';
import { store } from './redux/store/store';
import { resetAuthState } from './redux/reducers/authSlice';
import { resetAuthDoctorState } from './redux/reducers/authDoctorSlice';

//! Route group definitions
const publicRoutes = ['/', '/products'];
const authRoutes = ['/auth/login', '/auth/register'];
const protectedRoutes = [
  '/dashboard/user',
  '/dashboard/user/transactions',
  '/dashboard/doctor',
  '/admin',
  '/admin/product',
  '/admin/orders',
  '/admin/doctor-approval',
  '/admin/partner',
  '/partner',
  '/partner/orders',
];
const userOnlyRoutes = ['/dashboard/user', '/dashboard/user/transactions'];
const doctorOnlyRoutes = ['/dashboard/doctor'];
const adminOnlyRoutes = [
  '/admin',
  '/admin/product',
  '/admin/orders',
  '/admin/doctor-approval',
  '/admin/partner',
];
const partnerOnlyRoutes = ['/partner', '/partner/orders'];

export default async function middleware(request: NextRequest) {
  const prefix = process.env.NODE_ENV === 'production' ? '/vm4' : '';

  const response = NextResponse.next();

  const accessToken = cookies().get('access_token')?.value;
  const refreshToken = cookies().get('refresh_token')?.value;

  const userSessionCredentials: StandardDecodedJwtItf =
    await decodeJWT(accessToken);
  const tokenExpirationTime =
    userSessionCredentials.payload?.RegisteredClaims?.exp ?? 0;

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationThreshold = 5 * 60;

  if (
    accessToken !== undefined &&
    refreshToken !== undefined &&
    tokenExpirationTime - currentTime < expirationThreshold
  ) {
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      },
    );

    if (refreshResponse.ok) {
      const responseData = await refreshResponse.json();
      const newAccessToken = responseData?.data.access_token;
      response.cookies.set('access_token', newAccessToken, {
        priority: 'high',
        path: '/',
      });
    } else {
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      store.dispatch(resetAuthState());
      store.dispatch(resetAuthDoctorState());
    }
  }

  const redirectToHome = new URL(prefix + '/', request.nextUrl.href).toString();

  const redirectToLogin = new URL(
    prefix + '/auth/login',
    request.nextUrl.href,
  ).toString();

  const redirectToUserDashboard = new URL(
    prefix + '/dashboard/user',
    request.nextUrl.href,
  ).toString();

  const redirectToDoctorDashboard = new URL(
    prefix + '/dashboard/doctor',
    request.nextUrl.href,
  ).toString();

  const redirectToShop = new URL(
    prefix + '/products',
    request.nextUrl.href,
  ).toString();

  const redirectToAdminDashboard = new URL(
    prefix + '/admin',
    request.nextUrl.href,
  ).toString();

  const redirectToPartnerDashboard = new URL(
    prefix + '/partner',
    request.nextUrl.href,
  ).toString();

  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  // eslint-disable-next-line
  const isPublicRoute = publicRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);
  const isUserOnlyRoute = userOnlyRoutes.includes(path);
  const isDoctorOnlyRoute = doctorOnlyRoutes.includes(path);
  const isAdminOnlyRoute = adminOnlyRoutes.includes(path);
  const isPartnerOnlyRoute = partnerOnlyRoutes.includes(path);

  // eslint-disable-next-line
  const authId = userSessionCredentials?.payload?.Payload?.aid;
  const userRole = userSessionCredentials?.payload?.Payload?.role;
  // eslint-disable-next-line
  const isVerified = userSessionCredentials?.payload?.Payload?.is_verified;
  // eslint-disable-next-line
  const isApproved = userSessionCredentials?.payload?.Payload?.is_approved;

  if (isProtectedRoute && tokenExpirationTime < currentTime) {
    return NextResponse.redirect(redirectToLogin);
  }

  if (request.nextUrl.pathname.startsWith('/auth')) {
    const restrictedPaths = ['/auth', '/auth/'];

    if (restrictedPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(redirectToLogin);
    }
  }

  if (request.nextUrl.pathname.startsWith('/shop')) {
    const restrictedPaths = [
      '/shop',
      '/shop/',
      '/shop/checkout',
      '/shop/checkout/',
    ];

    if (restrictedPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(redirectToShop);
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

  if (tokenExpirationTime > currentTime) {
    if (isAuthRoute && userRole === 'user') {
      return NextResponse.redirect(redirectToUserDashboard);
    }

    if (isAuthRoute && userRole === 'doctor') {
      return NextResponse.redirect(redirectToDoctorDashboard);
    }

    if (isAuthRoute && userRole === 'admin') {
      return NextResponse.redirect(redirectToAdminDashboard);
    }

    if (isAuthRoute && userRole === 'manager') {
      return NextResponse.redirect(redirectToPartnerDashboard);
    }

    if (
      (isDoctorOnlyRoute || isAdminOnlyRoute || isPartnerOnlyRoute) &&
      userRole === 'user'
    ) {
      return NextResponse.redirect(redirectToHome);
    }

    if (
      (isUserOnlyRoute || isAdminOnlyRoute || isPartnerOnlyRoute) &&
      userRole === 'doctor'
    ) {
      return NextResponse.redirect(redirectToDoctorDashboard);
    }

    if (
      (isUserOnlyRoute || isAdminOnlyRoute || isDoctorOnlyRoute) &&
      userRole === 'manager'
    ) {
      return NextResponse.redirect(redirectToPartnerDashboard);
    }

    if (
      (isUserOnlyRoute || isPartnerOnlyRoute || isDoctorOnlyRoute) &&
      userRole === 'admin'
    ) {
      return NextResponse.redirect(redirectToPartnerDashboard);
    }
  }

  return response;
}

export const config = {
  matcher: ['/:path*'],
};
