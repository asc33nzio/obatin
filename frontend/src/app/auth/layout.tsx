'use client';
import React, { useEffect, useState } from 'react';
import { AuthPagesContainer, AuthRightSubcontainer } from '@/styles/Auth.styles';
import { WelcomeImage } from '@/assets/auth/WelcomeImage';

export default function AuthPageLayout({children}: {
  children: React.ReactNode;
}) {
  const [isDesktopDisplay, setIsDesktopDisplay] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopDisplay(window.innerWidth > 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDesktopDisplay]);
  return (
    <AuthPagesContainer>
      {isDesktopDisplay ? <WelcomeImage /> : null}
      <AuthRightSubcontainer $isDesktopDisplay={isDesktopDisplay}>
        {children}
      </AuthRightSubcontainer>
    </AuthPagesContainer>
  );
}
