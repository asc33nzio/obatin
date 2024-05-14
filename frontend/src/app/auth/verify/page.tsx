'use client';
import { navigateToHome, navigateToLogin } from '@/app/actions';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useToast } from '@/hooks/useToast';
import { VerifyPageContainer } from '@/styles/pages/auth/verify/VerifyPage.styles';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PacmanLoader, PropagateLoader } from 'react-spinners';
import { useObatinDispatch } from '@/redux/store/store';
import { deleteCookie } from 'cookies-next';
import { resetAuthState } from '@/redux/reducers/authSlice';
import { resetAuthDoctorState } from '@/redux/reducers/authDoctorSlice';
import Axios from 'axios';
import CustomButton from '@/components/atoms/button/CustomButton';

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useObatinDispatch();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [count, setCount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const token = searchParams.get('token');

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    const handleVerify = async () => {
      if (!token) {
        setToast({
          showToast: true,
          toastMessage: 'Token anda tidak berlaku',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        navigateToHome();
        return;
      }

      try {
        await Axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify?token=${token}`,
        );

        setIsSuccessful(true);
        localStorage.clear();
        deleteCookie('access_token');
        deleteCookie('refresh_token');
        dispatch(resetAuthState());
        dispatch(resetAuthDoctorState());

        setToast({
          showToast: true,
          toastMessage:
            'Akun anda berhasil diverifikasi, silahkan login kembali',
          toastType: 'ok',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
      } catch (error) {
        console.error(error);
        setToast({
          showToast: true,
          toastMessage: 'Maaf, verifikasi gagal, mohon coba kembali',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoading) {
      countdownInterval = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount === 0) {
            clearInterval(countdownInterval);
            navigateToLogin();
            return 0;
          }

          return prevCount - 1;
        });
      }, 1000);
    }

    handleVerify();

    return () => clearInterval(countdownInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, token]);

  return (
    <VerifyPageContainer>
      <PacmanLoader size={50} color={'#00B5C0'} />

      {isLoading ? (
        <PropagateLoader color='#dd1b50' speedMultiplier={0.8} size={'10px'} />
      ) : (
        <p>{`Anda akan diarahkan ke ${isSuccessful ? 'login' : 'beranda'} dalam ${count} detik...`}</p>
      )}

      <CustomButton
        content='Kembali ke Beranda'
        $width='200px'
        $height='40px'
        $fontSize='18px'
        onClick={() => navigateToHome()}
      />
    </VerifyPageContainer>
  );
};

export default VerifyPage;
