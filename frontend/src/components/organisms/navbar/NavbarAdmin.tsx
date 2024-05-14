/* eslint-disable react-hooks/exhaustive-deps */
import {
  IconContainer,
  ImgBg,
  Left,
  NavContainer,
  Right,
} from '@/styles/organisms/Navbar.styles';
import { navigateToAdminHome } from '@/app/actions';
import { Menu, ChevronLeft } from '@styled-icons/material';
import { useEffect } from 'react';
import { useNavbar } from '@/hooks/useNavbar';
import { usePathname } from 'next/navigation';
import DefaultDoctorAvatar from '@/assets/DefaultDoctorAvatar.svg';
import ObatinICO from '@/assets/icons/ObatinICO';
import Image from 'next/image';
import AdminSidebar from '../sidebar/AdminSidebar';

const NavbarAdmin = (): React.ReactElement => {
  const { isOpened, toggleDrawer, closeDrawer } = useNavbar();
  const pathname = usePathname();

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  return (
    <>
      <NavContainer>
        <Left>
          <IconContainer onClick={() => toggleDrawer()}>
            {isOpened ? <ChevronLeft /> : <Menu />}
          </IconContainer>
          <ObatinICO handleClick={() => navigateToAdminHome()} />
        </Left>
        <Right>
          <ImgBg>
            <Image
              src={DefaultDoctorAvatar}
              alt='avatar'
              width={75}
              height={75}
              priority={true}
            />
          </ImgBg>
        </Right>
      </NavContainer>
      <AdminSidebar />
    </>
  );
};

export default NavbarAdmin;
