'use client';
import { useEffect, useState } from 'react';
import ClientDisplayResolutionContext from '@/contexts/clientDisplayResolutionContext';

export const ClientDisplayResolutionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isDesktopDisplay, setIsDesktopDisplay] = useState<boolean>(true);

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
    <ClientDisplayResolutionContext.Provider value={{ isDesktopDisplay }}>
      {children}
    </ClientDisplayResolutionContext.Provider>
  );
};
