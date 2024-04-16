'use server';

import { redirect } from 'next/navigation';

export const navigateToRegister = async () => {
  redirect('/auth/register');
};

export const navigateToHome = async () => {
  redirect('/home');
};
