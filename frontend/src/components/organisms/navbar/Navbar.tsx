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
import {
  navigateToDoctorDashboard,
  navigateToLogin,
  navigateToUserDashboard,
} from '@/app/actions';
import { StandardDecodedJwtItf, UserRoles } from '@/types/jwtTypes';
import { decodeJWT } from '@/utils/decodeJWT';
import { useEffect, useState } from 'react';
import DefaultMaleAvatar from '@/assets/DefaultMaleAvatar.svg';
import DefaultFemaleAvatar from '@/assets/DefaultFemaleAvatar.svg';
import ObatinICO from '@/assets/icons/ObatinICO';
import SearchComponent from '../../molecules/search/SearchComponent';
import CustomButton from '../../atoms/button/CustomButton';
import Sidebar from '../sidebar/Sidebar';
import Image from 'next/image';

const Navbar = (): React.ReactElement => {
  const { isOpened, toggleDrawer } = useNavbar();
  const [aid, setAid] = useState<number>(0);
  const [userRole, setUserRole] = useState<UserRoles>('user');
  const userInfo = useObatinSelector((state) => state?.auth);
  const doctorInfo = useObatinSelector((state) => state?.authDoctor);
  const userGender = useObatinSelector((state) => state?.auth?.gender);
  const avatarUrlUser = useObatinSelector((state) => state?.auth?.avatarUrl);
  const avatarUrlDoctor = useObatinSelector(
    (state) => state?.authDoctor?.avatarUrl,
  );
  const accessToken = getCookie('access_token');

  useEffect(() => {
    const getUserInfo = async () => {
      const userSessionCredentials: StandardDecodedJwtItf =
        await decodeJWT(accessToken);

      const authId = userSessionCredentials?.payload?.Payload?.aid;
      const userRole = userSessionCredentials?.payload?.Payload?.role;

      if (authId) setAid(authId);
      if (userRole) setUserRole(userRole);

      console.log(userInfo);
      console.log(doctorInfo);
    };

    getUserInfo();
    // eslint-disable-next-line
  }, [accessToken]);

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
          {aid ? (
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
                src={
                  userRole === 'user' && avatarUrlUser
                    ? avatarUrlUser
                    : userRole === 'doctor' && avatarUrlDoctor
                      ? avatarUrlDoctor
                      : userGender === 'perempuan'
                        ? DefaultFemaleAvatar
                        : DefaultMaleAvatar
                }
                alt='avatar'
                width={75}
                height={75}
                onClick={() =>
                  userRole === 'user'
                    ? navigateToUserDashboard()
                    : navigateToDoctorDashboard()
                }
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
