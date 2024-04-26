import {
  IconContainer,
  Left,
  NavContainer,
} from '@/styles/organisms/Navbar.styles';
import { useObatinSelector } from '@/redux/store/store';
import { Menu, ChevronLeft } from '@styled-icons/material';
import { useNavbar } from '@/hooks/useNavbar';
import { navigateToLogin } from '@/app/actions';
import ObatinICO from '@/assets/icons/ObatinICO';
import SearchComponent from '../../molecules/search/SearchComponent';
import CustomButton from '../../atoms/button/CustomButton';
import Sidebar from '../sidebar/Sidebar';

const Navbar = (): React.ReactElement => {
  const { isOpened, toggleDrawer } = useNavbar();
  const userInfo = useObatinSelector((state) => state?.auth);
  const isLoggedIn = userInfo?.name !== '';

  return (
    <>
      <NavContainer>
        <Left>
          <IconContainer onClick={() => toggleDrawer()}>
            {isOpened ? <ChevronLeft /> : <Menu />}
          </IconContainer>
          <ObatinICO />
        </Left>

        <SearchComponent />

        {!isLoggedIn && (
          <CustomButton
            content='Login'
            $width='120px'
            $height='50px'
            $fontSize='16px'
            onClick={() => navigateToLogin()}
          />
        )}
      </NavContainer>

      <Sidebar />
    </>
  );
};

export default Navbar;
