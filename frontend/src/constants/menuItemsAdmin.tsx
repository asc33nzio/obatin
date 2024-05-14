import DoctorICO from '@/assets/icons/DoctorICO';
import HomeICO from '@/assets/icons/HomeICO';
import LogoutICO from '@/assets/icons/LogoutICO';
import OrderICO from '@/assets/icons/OrderICO';
import PartnerICO from '@/assets/icons/PartnerICO';
import ProductICO from '@/assets/icons/ProductICO';
import React from 'react';

type MenuOption = {
  name: string;
  icon: React.ComponentType | React.FC<any>;
  url: string;
  subItems?: MenuOption[];
};

const MENU_ADMIN: MenuOption[] = [
  {
    name: 'Beranda',
    icon: HomeICO,
    url: '/admin',
  },
  {
    name: 'Produk',
    icon: ProductICO,
    url: '/admin/product',
  },
  {
    name: 'Pesanan',
    icon: OrderICO,
    url: '/admin/orders',
  },
  {
    name: 'Akun Dokter',
    icon: DoctorICO,
    url: '/admin/doctor-approval',
  },
  {
    name: 'Partner',
    icon: PartnerICO,
    url: '/admin/partner',
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

export const MENU_ITEMS_ADMIN: MenuItem[] = makeMenuLevel(MENU_ADMIN);
