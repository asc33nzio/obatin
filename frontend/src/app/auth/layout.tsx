'use client';
import React from 'react';
import { AuthPagesContainer, AuthRightSubcontainer } from '@/styles/Auth';
import { WelcomeImage } from '@/assets/auth/WelcomeImage';

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthPagesContainer>
      <WelcomeImage />
      <AuthRightSubcontainer>{children}</AuthRightSubcontainer>
    </AuthPagesContainer>
  );
}
