'use client';
import { useState } from 'react';
import { NavbarItf } from '@/types/navbarTypes';
import NavbarContext from '@/contexts/navbarContext';

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isPopupOpened, setIsPopupOpened] = useState(false);

  const toggleDrawer = () => {
    setIsOpened(!isOpened);
  };

  const closeDrawer = () => {
    setIsOpened(false);
  };

  const contextValue: NavbarItf = {
    isOpened,
    toggleDrawer,
    closeDrawer,
    isPopupOpened,
    setIsPopupOpened,
  };

  return (
    <NavbarContext.Provider value={contextValue}>
      {children}
    </NavbarContext.Provider>
  );
};
