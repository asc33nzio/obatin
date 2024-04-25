import { useContext } from 'react';
import { NavbarItf } from '@/types/navbarTypes';
import NavbarContext from '@/contexts/navbarContext';

export const useNavbar = (): NavbarItf => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('Navbar context missing!');
  }

  return context;
};
