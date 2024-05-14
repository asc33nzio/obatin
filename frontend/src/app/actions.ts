'use server';
import { redirect } from 'next/navigation';

export const navigateToLogin = async () => {
  redirect('/auth/login');
};

export const navigateToRegister = async () => {
  redirect('/auth/register');
};

export const navigateToForgotPassword = async () => {
  redirect('/auth/forgot');
};

export const navigateToOnboarding = async () => {
  redirect('/auth/register/onboarding');
};

export const navigateToHome = async () => {
  redirect('/');
};

export const navigateToUserDashboard = async () => {
  redirect('/dashboard/user');
};

export const navigateToDoctorDashboard = async () => {
  redirect('/dashboard/doctor');
};

export const navigateToCheckout = async () => {
  redirect('/shop/checkout');
};

export const navigateToCart = async () => {
  redirect('/shop/cart');
};

export const navigateToProductList = async () => {
  redirect('/products');
};

export const navigateToDoctorList = async () => {
  redirect('/doctors');
};

export const navigateToTxHistory = async () => {
  redirect('/dashboard/user/transactions');
};

export const navigateToChat = async () => {
  redirect('/consultation');
};

export const navigateToProductDetail = async (slug: string) => {
  redirect(`/products/${slug}`);
};

export const navigateToAdminHome = async () => {
  redirect('/admin');
};

export const navigateToAdminOrders = async () => {
  redirect('/admin/orders');
};

export const navigateToAdminProduct = async () => {
  redirect('/admin/product');
};

export const navigateToAdminDoctorApproval = async () => {
  redirect('/admin/doctor-approval');
};

export const navigateToAdminPartner = async () => {
  redirect('/admin/partner');
};

export const navigateToPartnerHome = async () => {
  redirect('/partner');
};
