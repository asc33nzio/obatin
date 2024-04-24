import { MENU_ITEMS } from '@/constants/menu-items';
import {
  SidebarContainer,
  TOP,
} from '@/styles/organisms/sidebar/Sidebar.styles';
import { IconContainer } from '@/styles/organisms/Navbar.styles';
import { ChevronLeft } from '@styled-icons/material';
import MenuItemsList from './MenuItemList';
import ObatinICO from '@/assets/icons/ObatinICO';

type SidebarProps = {
  isOpened: boolean;
  toggleDrawer: () => void;
};

export default function Sidebar({
  isOpened,
  toggleDrawer,
}: SidebarProps): React.ReactElement {
  return (
    <SidebarContainer $isOpened={isOpened}>
      <TOP>
        <ObatinICO />
        <IconContainer onClick={toggleDrawer}>
          {isOpened ? <ChevronLeft /> : null}
        </IconContainer>
      </TOP>
      <MenuItemsList options={MENU_ITEMS} />
    </SidebarContainer>
  );
}
