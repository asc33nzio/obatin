'use client';
import React, { useState } from 'react';
import {
  LoginOrRegisterFormContainer,
  OAuthDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/Auth.styles';
import { debounce } from '@/utils/debounce';
import { useToast } from '@/app/ToastProvider';
import { useClientDisplayResolution } from '@/app/ClientDisplayResolutionProvider';
import { navigateToHome } from '@/app/auth/actions';
import PasswordInput from '../PasswordInput';
import CustomButton from '../CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';

const SetPasswordForm = (): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [password, setPassword] = useState<string>('');
  const [passwordValidationError, setPasswordValidationError] =
    useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmPasswordValidationError, setConfirmPasswordValidationError] =
    useState<string>('');

  const validatePassword = (input: string) => {
    const sanitizedInput = input.trim();

    if (sanitizedInput.length < 6) {
      setPasswordValidationError('Sandi harus lebih dari 6 karakter');
      return false;
    }

    setPasswordValidationError('');
    return true;
  };

  const validateConfirmPassword = (input: string) => {
    const sanitizedInput = input.trim();

    if (sanitizedInput.length === 0) {
      setConfirmPasswordValidationError('Konfirmasi sandi tidak boleh kosong');
      return false;
    }

    if (sanitizedInput !== password) {
      setConfirmPasswordValidationError(
        'Konfirmasi sandi tidak sama. Mohon cek kembali',
      );
      return false;
    }

    setConfirmPasswordValidationError('');
    return true;
  };

  const handlePasswordInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      validatePassword(event.target.value);
    },
    750,
  );

  const handleConfirmPasswordInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(event.target.value);
      validateConfirmPassword(event.target.value);
    },
    750,
  );

  const handleSignUp = () => {
    const isValidPassword = validatePassword(password);
    const isValidConfimPassword = validateConfirmPassword(confirmPassword);

    if (!isValidPassword || !isValidConfimPassword) {
      setToast({
        showToast: true,
        toastMessage: 'Pendaftaran gagal',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    //? POST request

    setToast({
      showToast: true,
      toastMessage: 'Berhasil mendaftar',
      toastType: 'ok',
      resolution: isDesktopDisplay ? 'desktop' : 'mobile',
      orientation: 'center',
    });
    navigateToHome();
  };

  return (
    <LoginOrRegisterFormContainer $isLoginPage={true}>
      <h1>Buat Kata Sandi</h1>

      <PasswordInput
        title='Kata Sandi'
        placeholder='Kata Sandi'
        onChange={handlePasswordInputChange}
        validationMessage={passwordValidationError}
      />

      <PasswordInput
        title='Konfirmasi Kata Sandi'
        placeholder='Konfirmasi Kata Sandi'
        onChange={handleConfirmPasswordInputChange}
        validationMessage={confirmPasswordValidationError}
      />

      <CustomButton content='Daftar' onClick={handleSignUp} />

      <SectionSeparator>
        <SeparatorLine />
        ATAU
        <SeparatorLine />
      </SectionSeparator>

      <OAuthDiv $isDesktopDisplay={isDesktopDisplay}>
        <GoogleICO />
        <p>Lanjutkan Dengan Google</p>
      </OAuthDiv>
    </LoginOrRegisterFormContainer>
  );
};

export default SetPasswordForm;
