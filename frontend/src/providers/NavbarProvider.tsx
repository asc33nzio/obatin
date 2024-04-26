'use client';
import { useState } from 'react';
import { NavbarItf } from '@/types/navbarTypes';
import NavbarContext from '@/contexts/navbarContext';

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [navbarState, setNavbarState] = useState<NavbarItf>({
    isOpened: false,
    toggleDrawer: () => {},
  });

  const toggleDrawer: NavbarItf['toggleDrawer'] = () => {
    setNavbarState((prevState) => ({
      ...prevState,
      isOpened: !prevState.isOpened,
    }));
  };

  const { isOpened } = navbarState;

  return (
    <NavbarContext.Provider
      value={{
        isOpened,
        toggleDrawer,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};
