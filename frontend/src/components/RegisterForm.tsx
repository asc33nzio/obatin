'use client';
import React, { useState } from 'react';
import { debounce } from '@/utils/debounce';
import { useToast } from '@/app/ToastProvider';
import { useClientDisplayResolution } from '@/app/ClientDisplayResolutionProvider';
import {
  navigateToHome,
  navigateToLogin,
  navigateToSetPassword,
} from '@/app/auth/actions';
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
import SpecializationOption from './SpecializationOption';

const RegisterForm = (): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailValidationError, setEmailValidationError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordValidationError, setPasswordValidationError] =
    useState<string>('');
  const [userUpload, setUserUpload] = useState<File | undefined>(undefined);
  const [userUploadValidationError, setUserUploadValidationError] =
    useState<string>('');
  const specializations = ['bidan', 'kulit kelamin', 'internis'];
  const [selectedOption, setSelectedOption] = useState<string>('');

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

  const validateUpload = (input: File | undefined) => {
    if (input === undefined) {
      setUserUploadValidationError(
        'Anda harus mengunggah sertifikat untuk mendaftar',
      );
      return false;
    }

    const acceptableUploadExtensions = [
      'image/jpg',
      'image/jpeg',
      'image/webp',
      'image/svg',
      'image/svg+xml',
      'image/png',
      'application/pdf',
    ];
    let validUploadExtension = false;
    for (let i = 0; i < acceptableUploadExtensions.length; i++) {
      if (input.type === acceptableUploadExtensions[i]) {
        validUploadExtension = true;
        break;
      }
    }

    if (!validUploadExtension) {
      setUserUploadValidationError(
        'Format gambar salah. Hanya boleh mengunggah jpg/jpeg/webp/svg/png/pdf',
      );
      return false;
    }

    if (input.size > 1 * 500 * 1000) {
      setUserUploadValidationError('Ukuran file tidak boleh lebih dari 500kb');
      return false;
    }

    setUserUploadValidationError('');
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

  const handleCertificateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const userUpload = event?.target?.files?.[0];
    setUserUpload(userUpload);
    validateUpload(userUpload);
  };

  const handleTabChange = (isDoctor: boolean) => {
    setEmail('');
    setEmailValidationError('');
    setPassword('');
    setPasswordValidationError('');
    setSelectedOption('');
    setUserUpload(undefined);
    setUserUploadValidationError('');
    setIsDoctor(isDoctor);
  };

  const handleOptionChange = (selectedValue: string) => {
    setSelectedOption(selectedValue);
  };

  const handleSignUpPatient = () => {
    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password);

    if (!isValidEmail || !isValidPassword) {
      setToast({
        showToast: true,
        toastMessage: 'Gagal mendaftar',
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

  const handleSignUpDoctor = () => {
    const isValidEmail = validateEmail(email);
    const isValidUpload = validateUpload(userUpload);

    if (!isValidEmail || !isValidUpload) {
      setToast({
        showToast: true,
        toastMessage: 'Gagal mendaftar',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    // console.log(selectedOption) -- specialization select
    //? POST request

    //! temp -- onboarding flow for successful doctor registration
    // fill form -> get email with temp password -> can login with temp pass -> tracking page -> admin approval -> set new password
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
          onClick={() => handleTabChange(false)}
        >
          <PatientICO />
          Pasien
        </SelectUserTypeBox>

        <SelectUserTypeBox
          $isActive={isDoctor}
          onClick={() => handleTabChange(true)}
        >
          <DoctorICO />
          Dokter
        </SelectUserTypeBox>
      </UserTypeSelectionSection>

      {isDoctor ? (
        <>
          <RegularInput
            title='E-mail'
            placeholder='E-mail'
            validationMessage={emailValidationError}
            onChange={handleEmailInputChange}
            $marBot={0}
          />
          <SpecializationOption
            title='Specialization'
            $marBot={0}
            options={specializations}
            onOptionChange={handleOptionChange}
          />
          <RegularInput
            type='file'
            title='Sertifikat Doktor'
            placeholder='Unggah file'
            validationMessage={userUploadValidationError}
            onChange={handleCertificateChange}
            $marBot={15}
            accept='image/*,.pdf'
          />
        </>
      ) : (
        <>
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
        </>
      )}

      <CustomButton
        content='Lanjutkan'
        onClick={
          isDoctor ? () => handleSignUpDoctor() : () => handleSignUpPatient()
        }
      />

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

export default RegisterForm;
