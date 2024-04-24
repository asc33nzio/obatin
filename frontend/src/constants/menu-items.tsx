import CartICO from '@/assets/icons/CartICO';
import ConsulICO from '@/assets/icons/ConsulICO';
import DoctorICO from '@/assets/icons/DoctorICO';
import HomeICO from '@/assets/icons/HomeICO';
import OrderICO from '@/assets/icons/OrderICO';
import UserICO from '@/assets/icons/UserICO';

type MenuOption = {
  name: string;
  icon: React.ComponentType;
  url: string;
  subItems?: MenuOption[];
};

const MENU_OPTIONS: MenuOption[] = [
  {
    name: 'Home',
    icon: HomeICO,
    url: '/',
  },
  {
    name: 'Profile',
    icon: UserICO,
    url: '/home',
  },
  {
    name: 'Cart',
    icon: CartICO,
    url: '/home',
  },
  {
    name: 'Order History',
    icon: OrderICO,
    url: '/home',
  },
  {
    name: 'Consultation',
    icon: ConsulICO,
    url: '/home',
  },
  {
    name: 'Doctor',
    icon: DoctorICO,
    url: '/home',
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

export const MENU_ITEMS: MenuItem[] = makeMenuLevel(MENU_OPTIONS);
