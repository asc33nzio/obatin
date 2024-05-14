import {
  SidebarContainer,
  TOP,
} from '@/styles/organisms/sidebar/Sidebar.styles';
import { IconContainer } from '@/styles/organisms/Navbar.styles';
import { ChevronLeft } from '@styled-icons/material';
import { useNavbar } from '@/hooks/useNavbar';
import ObatinICO from '@/assets/icons/ObatinICO';
import { navigateToAdminHome } from '@/app/actions';
import { MENU_ITEMS_ADMIN } from '@/constants/menuItemsAdmin';
import MenuItemsListAdmin from './MenuItemListAdmin';

const AdminSidebar = (): React.ReactElement => {
  const { isOpened, toggleDrawer } = useNavbar();

  return (
    <SidebarContainer $isOpened={isOpened}>
      <TOP>
        <ObatinICO handleClick={() => navigateToAdminHome()} />
        <IconContainer onClick={() => toggleDrawer()}>
          {isOpened ? <ChevronLeft /> : null}
        </IconContainer>
      </TOP>
      <MenuItemsListAdmin options={MENU_ITEMS_ADMIN} />
    </SidebarContainer>
  );
};

export default AdminSidebar;
