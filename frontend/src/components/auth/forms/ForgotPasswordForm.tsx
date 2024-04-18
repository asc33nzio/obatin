'use client';
import React, { useState } from 'react';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  ReturnHomeContainerDiv,
} from '@/styles/Auth.styles';
import { debounce } from '@/utils/debounce';
import { useToast } from '@/app/ToastProvider';
import { useClientDisplayResolution } from '@/app/ClientDisplayResolutionProvider';
import { navigateToHome, navigateToLogin } from '@/app/auth/actions';
import RegularInput from '../RegularInput';
import CustomButton from '../CustomButton';
import LeftArrowICO from '@/assets/arrows/LeftArrowICO';

const ForgotPasswordForm = (): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [email, setEmail] = useState<string>('');
  const [emailValidationError, setEmailValidationError] = useState<string>('');

  const validateEmail = (input: string) => {
    const sanitizedInput = input.trim();

    if (input.length < 3) {
      setEmailValidationError('E-mail harus lebih dari 3 karakter');
      return false;
    }

    if (!/^[\w-.]+(\+[\w-]+)?@([\w-]+\.)+[\w-]{2,4}$/.test(sanitizedInput)) {
      setEmailValidationError('Pola e-mail tidak sesuai');
      return false;
    }

    setEmailValidationError('');
    return true;
  };

  const handleEmailInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      validateEmail(event.target.value);
    },
    750,
  );

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
