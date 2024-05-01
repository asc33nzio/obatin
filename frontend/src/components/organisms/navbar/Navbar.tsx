import {
  IconContainer,
  ImgBg,
  Left,
  NavContainer,
  Right,
} from '@/styles/organisms/Navbar.styles';
import { getCookie } from 'cookies-next';
import { useObatinSelector } from '@/redux/store/store';
import { Menu, ChevronLeft } from '@styled-icons/material';
import { useNavbar } from '@/hooks/useNavbar';
import { navigateToLogin, navigateToUserDashboard } from '@/app/actions';
import ObatinICO from '@/assets/icons/ObatinICO';
import SearchComponent from '../../molecules/search/SearchComponent';
import CustomButton from '../../atoms/button/CustomButton';
import Sidebar from '../sidebar/Sidebar';
import Image from 'next/image';

const Navbar = (): React.ReactElement => {
  const { isOpened, toggleDrawer } = useNavbar();
  const avatarUrl = useObatinSelector((state) => state?.auth?.avatarUrl);
  const accessToken = getCookie('access_token');
  const isLoggedIn = accessToken !== undefined;

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

        <Right>
          {!isLoggedIn ? (
            <CustomButton
              content='Login'
              $width='120px'
              $height='50px'
              $fontSize='16px'
              onClick={() => navigateToLogin()}
            />
          ) : (
            <ImgBg>
              <Image
                src={avatarUrl}
                alt='avatar'
                width={75}
                height={75}
                onClick={() => navigateToUserDashboard()}
              />
            </ImgBg>
          )}
        </Right>
      </NavContainer>

      <Sidebar />
    </>
  );
};

export default Navbar;
