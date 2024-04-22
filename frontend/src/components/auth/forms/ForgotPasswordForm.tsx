'use client';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  ReturnHomeContainerDiv,
} from '@/styles/Auth.styles';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { navigateToDashboard, navigateToHome, navigateToLogin } from '@/app/actions';
import RegularInput from '../RegularInput';
import CustomButton from '../../elements/button/CustomButton';
import LeftArrowICO from '@/assets/arrows/LeftArrowICO';
import { useEffect } from 'react';
import { getCookie } from 'cookies-next';

const ForgotPasswordForm = (): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const {
    email,
    validateEmail,
    emailValidationError,
    handleEmailInputChange,
  } = useEmailValidation();

  const handleResetPasswordRequest = () => {
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

    //? GET request
    //? POST request

    setToast({
      showToast: true,
      toastMessage: 'Berhasil. Cek e-mail anda',
      toastType: 'ok',
      resolution: isDesktopDisplay ? 'desktop' : 'mobile',
      orientation: 'center',
    });
    navigateToHome();
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

      <CustomButton content='Daftar' onClick={handleResetPasswordRequest} />

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
