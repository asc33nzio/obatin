import {
  SidebarContainer,
  TOP,
} from '@/styles/organisms/sidebar/Sidebar.styles';
import { MENU_ITEMS_USER } from '@/constants/menu-items';
import { IconContainer } from '@/styles/organisms/Navbar.styles';
import { ChevronLeft } from '@styled-icons/material';
import { useNavbar } from '@/hooks/useNavbar';
import MenuItemsList from './MenuItemList';
import ObatinICO from '@/assets/icons/ObatinICO';

const Sidebar = (): React.ReactElement => {
  const { isOpened, toggleDrawer } = useNavbar();

  return (
    <SidebarContainer $isOpened={isOpened}>
      <TOP>
        <ObatinICO />
        <IconContainer onClick={() => toggleDrawer()}>
          {isOpened ? <ChevronLeft /> : null}
        </IconContainer>
      </TOP>
      <MenuItemsList options={MENU_ITEMS_USER} />
    </SidebarContainer>
  );
};

export default Sidebar;
