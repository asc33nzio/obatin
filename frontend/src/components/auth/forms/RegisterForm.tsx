'use client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import {
  navigateToDashboard,
  navigateToHome,
  navigateToLogin,
} from '@/app/actions';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  SectionSeparator,
  SelectUserTypeBox,
  SeparatorLine,
  UserTypeSelectionSection,
} from '@/styles/Auth.styles';
import RegularInput from '../RegularInput';
import CustomButton from '../../elements/button/CustomButton';
import PasswordInput from '../PasswordInput';
import SpecializationSelect from '../SpecializationSelect';
import GoogleICO from '@/assets/icons/GoogleICO';
import PatientICO from '@/assets/auth/PatientICO';
import DoctorICO from '@/assets/auth/DoctorICO';
import { getCookie } from 'cookies-next';

const RegisterForm = (): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const {
    email,
    setEmail,
    validateEmail,
    emailValidationError,
    setEmailValidationError,
    handleEmailInputChange,
  } = useEmailValidation();
  const {
    password,
    setPassword,
    validatePassword,
    passwordValidationError,
    setPasswordValidationError,
    handlePasswordInputChange,
  } = usePasswordValidation();
  const [userUpload, setUserUpload] = useState<File | undefined>(undefined);
  const [userUploadValidationError, setUserUploadValidationError] =
    useState<string>('');
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const specializations = ['bidan', 'kulit kelamin', 'internis'];
  const [selectedOption, setSelectedOption] = useState<string>(
    specializations[1],
  );

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

    const payload = {
      email: email,
      specialization: selectedOption,
      certificate: userUpload,
    };

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

    if (selectedOption === '') {
      setToast({
        showToast: true,
        toastMessage: 'Anda belum memilih spesialisasi',
        toastType: 'warning',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    // console.log(selectedOption) -- specialization select
    //? POST request

    //! temp -- onboarding flow for successful doctor registration
    // fill form -> get email with temp password -> can login with temp pass -> tracking page -> admin approval -> set new password
    
    setToast({
      showToast: true,
      toastMessage: 'Terima kasih! Tolong cek e-mail anda',
      toastType: 'ok',
      resolution: isDesktopDisplay ? 'desktop' : 'mobile',
      orientation: 'center',
    });
    navigateToLogin();
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
          <SpecializationSelect
            title='Spesialisasi'
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
            $viewBox='0 -2 22 22'
            $viewBoxHide='0 0 22 22'
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
