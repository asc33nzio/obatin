import {
  CartContainer,
  IconContainer,
  ImgBg,
  Left,
  NavContainer,
  Quantity,
  Right,
  VerifyPopup,
} from '@/styles/organisms/Navbar.styles';
import {
  navigateToDoctorDashboard,
  navigateToLogin,
  navigateToUserDashboard,
} from '@/app/actions';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useObatinSelector } from '@/redux/store/store';
import { Menu, ChevronLeft } from '@styled-icons/material';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { useNavbar } from '@/hooks/useNavbar';
import { decodeJWTSync } from '@/utils/decodeJWT';
import { useToast } from '@/hooks/useToast';
import { navigateToCart } from '@/app/actions';
import { CartItem } from '@/redux/reducers/cartSlice';
import { usePathname } from 'next/navigation';
import DefaultMaleAvatar from '@/assets/DefaultMaleAvatar.svg';
import DefaultFemaleAvatar from '@/assets/DefaultFemaleAvatar.svg';
import DefaultDoctorAvatar from '@/assets/DefaultDoctorAvatar.svg';
import ObatinICO from '@/assets/icons/ObatinICO';
import SearchComponent from '../../molecules/search/SearchComponent';
import CustomButton from '../../atoms/button/CustomButton';
import Sidebar from '../sidebar/Sidebar';
import Image from 'next/image';
import Axios from 'axios';
import ClosePopupICO from '@/assets/icons/ClosePopupICO';
import CartICO from '@/assets/icons/CartICO';

const Navbar = (): React.ReactElement => {
  const { isOpened, toggleDrawer, isPopupOpened, setIsPopupOpened } =
    useNavbar();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const userInfo = useObatinSelector((state) => state?.auth);
  const userGender = useObatinSelector((state) => state?.auth?.gender);
  const avatarUrlUser = useObatinSelector((state) => state?.auth?.avatarUrl);
  const quantity = useObatinSelector((state) => state?.cart);
  const avatarUrlDoctor = useObatinSelector(
    (state) => state?.authDoctor?.avatarUrl,
  );
  const accessToken = getCookie('access_token');
  const userSessionCredentials = decodeJWTSync(accessToken?.toString());
  const userRole = userSessionCredentials?.payload?.Payload?.role;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userCart = useObatinSelector((state) => state?.cart);
  const pathname = usePathname();

  const handleReverify = async () => {
    try {
      if (isLoading) {
        setToast({
          showToast: true,
          toastMessage: 'Sedang diproses, mohon menunggu',
          toastType: 'warning',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }

      setIsLoading(true);
      setToast({
        showToast: true,
        toastMessage: 'Mohon menunggu sejenak',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });

      await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify/mail`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setToast({
        showToast: true,
        toastMessage: 'E-mail verifikasi telah dikirim, cek e-mail anda',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, mohon coba kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const postToCart = async () => {
    try {
      if (userCart.items.length > 0) {
        const cartItems: CartItem[] = userCart.items.map((item) => {
          if (item.product_id === undefined)
            throw new Error('Product ID is undefined');
          return {
            product_id: item.product_id,
            prescription_id: item.prescription_id ?? null,
            pharmacy_id: item.pharmacy_id ?? null,
            quantity: item.quantity,
          };
        });

        const payload = {
          cart: cartItems,
        };

        await Axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/shop/cart`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        navigateToCart();
      }
    } catch (error: any) {
      console.log(error);
      const resStatus = error?.response?.status;
      setToast({
        showToast: true,
        toastMessage:
          resStatus === 403
            ? 'Anda belum memverifikasi akun anda'
            : resStatus === 404
              ? 'Buatlah alamat terlebih dahulu'
              : '',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      if (resStatus === 404) navigateToUserDashboard();
    }
  };

  const handleCartClick = async () => {
    setIsLoading(true);
    setToast({
      showToast: true,
      toastMessage: 'Mohon menunggu sejenak',
      toastType: 'ok',
      resolution: isDesktopDisplay ? 'desktop' : 'mobile',
      orientation: 'center',
    });

    try {
      await postToCart();
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, terjadi kesalahan',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsPopupOpened(
      userRole === 'user' && !userInfo?.isVerified ? true : false,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    toggleDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <NavContainer>
        <Left>
          <IconContainer onClick={() => toggleDrawer()}>
            {isOpened ? <ChevronLeft /> : <Menu />}
          </IconContainer>
          <ObatinICO />
        </Left>

        {userRole === 'user' && <SearchComponent />}

        <Right>
          {accessToken === undefined ? (
            <CustomButton
              content='Login'
              $width='120px'
              $height='50px'
              $fontSize='16px'
              onClick={() => navigateToLogin()}
            />
          ) : (
            <>
              <CartContainer onClick={() => handleCartClick()}>
                <CartICO />
                <Quantity>{quantity.totalQuantity}</Quantity>
              </CartContainer>
              <ImgBg>
                <Image
                  src={
                    userRole === 'user' && avatarUrlUser
                      ? avatarUrlUser
                      : userRole === 'doctor' && avatarUrlDoctor
                        ? avatarUrlDoctor
                        : userRole === 'user' && userGender === 'perempuan'
                          ? DefaultFemaleAvatar
                          : userRole === 'user' && userGender === 'laki-laki'
                            ? DefaultMaleAvatar
                            : DefaultDoctorAvatar
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
            </>
          )}
        </Right>
      </NavContainer>

      <VerifyPopup $isPopupOpen={isPopupOpened}>
        <p>
          Selamat datang di ObatIn. Segera lakukan verifikasi e-mail agar anda
          dapat mengakses semua layanan kami.
          <u onClick={handleReverify}>Klik disini</u> bila belum menerima
          e-mail. Salam sehat dan terima kasih
        </p>
        <ClosePopupICO
          onClick={!isLoading ? () => setIsPopupOpened(false) : () => {}}
        />
      </VerifyPopup>

      <Sidebar />
    </>
  );
};

export default Navbar;
