'use client';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  ReturnHomeContainerDiv,
} from '@/styles/Auth.styles';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import {
  navigateToDashboard,
  navigateToLogin,
} from '@/app/actions';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import RegularInput from '../RegularInput';
import CustomButton from '../../elements/button/CustomButton';
import LeftArrowICO from '@/assets/arrows/LeftArrowICO';
import Axios from 'axios';

const ForgotPasswordForm = (): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const { email, validateEmail, emailValidationError, handleEmailInputChange } =
    useEmailValidation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleResetPasswordRequest = async () => {
    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      setToast({
        showToast: true,
        toastMessage: 'Pengajuan reset sandi gagal',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    const payload = {
      email: email,
    };

    try {
      setIsLoading(true);
      await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`,
        payload,
      );

      setToast({
        showToast: true,
        toastMessage: 'Berhasil. Cek e-mail anda',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      navigateToLogin();
    } catch (error: any) {
      const errMsg = error?.response?.data?.message;
      setToast({
        showToast: true,
        toastMessage: errMsg ? errMsg : 'Gagal. Cek kembali e-mail anda',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isAuthenticatedCheck = () => {
      const sessionToken = getCookie('session_token');
      if (sessionToken !== undefined) {
        navigateToDashboard();
      }
    };

    isAuthenticatedCheck();
  }, []);

  return (
    <LoginOrRegisterFormContainer $isLoginPage={true}>
      <h1>Lupa Kata Sandi?</h1>

      <CreateOrLoginSpan $marBot={25}>
        <p>Jangan kawathir! Masukkan e-mail terdaftar untuk reset sandi</p>
      </CreateOrLoginSpan>

      <RegularInput
        title='E-mail'
        placeholder='E-mail'
        onChange={handleEmailInputChange}
        validationMessage={emailValidationError}
        $marBot={25}
      />

      <CustomButton
        content='Reset Sandi'
        onClick={handleResetPasswordRequest}
        disabled={isLoading}
      />

      <ReturnHomeContainerDiv>
        <span onClick={() => navigateToLogin()}>
          <LeftArrowICO />
          Kembali Ke Login
        </span>
      </ReturnHomeContainerDiv>
    </LoginOrRegisterFormContainer>
  );
};

export default ForgotPasswordForm;
