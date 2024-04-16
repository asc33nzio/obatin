'use server';

import { redirect } from 'next/navigation';

export const navigateToSetPassword = async () => {
  redirect('/auth/register/set-password');
};

export const navigateToLogin = async () => {
  redirect('/auth/login');
};
