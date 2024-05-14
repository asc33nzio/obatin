/* eslint-disable react-hooks/exhaustive-deps */
import {
  IconContainer,
  ImgBg,
  Left,
  NavContainer,
  Right,
} from '@/styles/organisms/Navbar.styles';
import { navigateToDoctorDashboard } from '@/app/actions';
import { Menu, ChevronLeft } from '@styled-icons/material';
import { useEffect } from 'react';
import { useNavbar } from '@/hooks/useNavbar';
import { usePathname } from 'next/navigation';
import DefaultDoctorAvatar from '@/assets/DefaultDoctorAvatar.svg';
import ObatinICO from '@/assets/icons/ObatinICO';
import Image from 'next/image';
import DoctorSidebar from '../sidebar/DoctorSidebar';

const NavbarDoctor = (): React.ReactElement => {
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
          <ObatinICO handleClick={() => navigateToDoctorDashboard()} />
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
      <DoctorSidebar />
    </>
  );
};

export default NavbarDoctor;
