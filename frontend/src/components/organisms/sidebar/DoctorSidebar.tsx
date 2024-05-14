import {
  SidebarContainer,
  TOP,
} from '@/styles/organisms/sidebar/Sidebar.styles';
import { IconContainer } from '@/styles/organisms/Navbar.styles';
import { ChevronLeft } from '@styled-icons/material';
import { useNavbar } from '@/hooks/useNavbar';
import ObatinICO from '@/assets/icons/ObatinICO';
import { navigateToDoctorDashboard } from '@/app/actions';
import MenuItemsListAdmin from './MenuItemListAdmin';
import { MENU_ITEMS_DOCTOR } from '@/constants/menuItemsDoctor';

const DoctorSidebar = (): React.ReactElement => {
  const { isOpened, toggleDrawer } = useNavbar();

  return (
    <SidebarContainer $isOpened={isOpened}>
      <TOP>
        <ObatinICO handleClick={() => navigateToDoctorDashboard()} />
        <IconContainer onClick={() => toggleDrawer()}>
          {isOpened ? <ChevronLeft /> : null}
        </IconContainer>
      </TOP>
      <MenuItemsListAdmin options={MENU_ITEMS_DOCTOR} />
    </SidebarContainer>
  );
};

export default DoctorSidebar;
