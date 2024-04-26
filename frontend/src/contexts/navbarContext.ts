import { NavbarItf } from '@/types/navbarTypes';
import { createContext } from 'react';

const NavbarContext = createContext<NavbarItf | undefined>(undefined);

export default NavbarContext;
