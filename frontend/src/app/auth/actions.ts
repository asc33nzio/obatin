'use server';
import { redirect } from 'next/navigation';

export const navigateToLogin = async () => {
    redirect('/auth/login');
};

export const navigateToRegister = async () => {
    redirect('/auth/register');
};

export const navigateToSetPassword = async () => {
  redirect('/auth/register/onboarding/');
};

export const navigateToForgotPassword = async () => {
  redirect('/auth/forgot-password');
};

export const navigateToHome = async () => {
  redirect('/home');
};
