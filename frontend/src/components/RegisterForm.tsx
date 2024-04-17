'use client';
import React, { useState } from 'react';
import { debounce } from '@/utils/debounce';
import { useToast } from '@/app/ToastProvider';
import { useClientDisplayResolution } from '@/app/ClientDisplayResolutionProvider';
import {
  navigateToLogin,
  navigateToSetPassword,
} from '@/app/auth/register/actions';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  SectionSeparator,
  SelectUserTypeBox,
  SeparatorLine,
  UserTypeSelectionSection,
} from '@/styles/Auth.styles';
import RegularInput from '@/components/RegularInput';
import CustomButton from '@/components/CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';
import PasswordInput from './PasswordInput';
import PatientICO from '@/assets/auth/PatientICO';
import DoctorICO from '@/assets/auth/DoctorICO';

const RegisterForm = (): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailValidationError, setEmailValidationError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordValidationError, setPasswordValidationError] =
    useState<string>('');

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

  const validatePassword = (input: string) => {
    const sanitizedInput = input.trim();

    if (sanitizedInput.length < 6) {
      setPasswordValidationError('Sandi harus lebih dari 6 karakter');
      return false;
    }

    setPasswordValidationError('');
    return true;
  };

  const handleEmailInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      validateEmail(event.target.value);
    },
    750,
  );

  const handlePasswordInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      validatePassword(event.target.value);
    },
    750,
  );

  const handleSignUp = () => {
    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      setToast({
        showToast: true,
        toastMessage: 'Gagal mendaftar',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    navigateToSetPassword();
  };

  return (
    <LoginOrRegisterFormContainer $isLoginPage={false}>
      <h1>Pendaftaran</h1>

      <CreateOrLoginSpan $marBot={10}>
        <p>Sudah memiliki akun?</p>
        <u onClick={() => navigateToLogin()}>Login Disini</u>
      </CreateOrLoginSpan>

      <UserTypeSelectionSection>
        <SelectUserTypeBox
          $isActive={!isDoctor}
          onClick={() => setIsDoctor(false)}
        >
          <PatientICO />
          Pasien
        </SelectUserTypeBox>

        <SelectUserTypeBox $isActive={isDoctor} onClick={() => setIsDoctor(true)}>
          <DoctorICO />
          Dokter
        </SelectUserTypeBox>
      </UserTypeSelectionSection>

      <RegularInput
        title='E-mail'
        placeholder='E-mail'
        validationMessage={emailValidationError}
        onChange={handleEmailInputChange}
        $marBot={10}
      />

      <PasswordInput
        title='Kata Sandi'
        placeholder='Kata Sandi'
        onChange={handlePasswordInputChange}
        validationMessage={passwordValidationError}
      />

      <CustomButton content='Lanjutkan' onClick={handleSignUp} />

      <SectionSeparator>
        <SeparatorLine />
        ATAU
        <SeparatorLine />
      </SectionSeparator>

      <OAuthDiv>
        <GoogleICO />
        <p>Lanjutkan Dengan Google</p>
      </OAuthDiv>
    </LoginOrRegisterFormContainer>
  );
};

export default RegisterForm;
