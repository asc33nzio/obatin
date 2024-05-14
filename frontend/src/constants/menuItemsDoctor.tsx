import ConsulICO from '@/assets/icons/ConsulICO';
import HomeICO from '@/assets/icons/HomeICO';
import LogoutICO from '@/assets/icons/LogoutICO';
import UserICO from '@/assets/icons/UserICO';
import React from 'react';

type MenuOption = {
  name: string;
  icon: React.ComponentType | React.FC<any>;
  url: string;
  subItems?: MenuOption[];
};

const MENU_DOCTOR: MenuOption[] = [
  {
    name: 'Beranda',
    icon: HomeICO,
    url: '/dashboard/doctor',
  },
  {
    name: 'Profil',
    icon: UserICO,
    url: '/dashboard/doctor',
  },
  {
    name: 'Konsultasi',
    icon: ConsulICO,
    url: '/consultation',
  },
  {
    name: 'Keluar',
    icon: LogoutICO,
    url: '/auth/login',
  },
];

export type MenuItem = {
  name: string;
  icon: React.ComponentType;
  url: string;
  id: string;
  depth: number;
  subItems?: MenuItem[];
};

function makeMenuLevel(options: MenuOption[], depth = 0): MenuItem[] {
  return options.map((option, idx) => ({
    ...option,
    id: depth === 0 ? idx.toString() : `${depth}.${idx}`,
    depth,
    subItems:
      option.subItems && option.subItems.length > 0
        ? makeMenuLevel(option.subItems, depth + 1)
        : undefined,
  }));
}

export const MENU_ITEMS_DOCTOR: MenuItem[] = makeMenuLevel(MENU_DOCTOR);
