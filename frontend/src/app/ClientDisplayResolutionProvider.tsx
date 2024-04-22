'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ClientDisplayResolutionItf {
  isDesktopDisplay: boolean;
}

const ClientDisplayResolutionContext = createContext<
  ClientDisplayResolutionItf | undefined
>(undefined);

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

export const useClientDisplayResolution = () => {
  const context = useContext(ClientDisplayResolutionContext);
  if (!context) {
    throw new Error(
      'ClientDisplayResolution context missing!F',
    );
  }
  return context;
};
