'use client';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  SectionSeparator,
  SelectUserTypeBox,
  SeparatorLine,
  UserTypeSelectionSection,
} from '@/styles/pages/auth/Auth.styles';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { getCookie, setCookie } from 'cookies-next';
import { DoctorSpecializationsType } from '@/types/registerTypes';
import { navigateToDashboard, navigateToLogin } from '@/app/actions';
import RegularInput from '@/components/atoms/input/RegularInput';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import CustomButton from '@/components/atoms/button/CustomButton';
import SpecializationSelect from '@/components/atoms/select/SpecializationSelect';
import GoogleICO from '@/assets/icons/GoogleICO';
import PatientICO from '@/assets/auth/PatientICO';
import DoctorICO from '@/assets/auth/DoctorICO';
import Axios from 'axios';

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
  const [userUpload, setUserUpload] = useState<Blob | undefined>(undefined);
  const [userUploadValidationError, setUserUploadValidationError] =
    useState<string>('');
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [specializations, setSpecializations] = useState<
    Array<DoctorSpecializationsType>
  >([]);
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateUpload = (input: Blob | undefined) => {
    if (input === undefined) {
      setUserUploadValidationError(
        'Anda harus mengunggah sertifikat untuk mendaftar',
      );
      return false;
    }

    if (input.type !== 'application/pdf') {
      setUserUploadValidationError(
        'Format gambar salah. Hanya boleh mengunggah .pdf',
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
    setSelectedOption(1);
    setUserUpload(undefined);
    setUserUploadValidationError('');
    setIsDoctor(isDoctor);
  };

  const handleOptionChange = (selectedValue: number) => {
    setSelectedOption(selectedValue);
  };

  const handleSignUpPatient = async () => {
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
      password: password,
    };

    try {
      await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/users`,
        payload,
      );

      const response = await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        payload,
      );

      const access_token = response?.data?.data?.access_token;

      if (
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_VALID_DURATION_MS === undefined
      ) {
        throw new Error('please define access token valid duration env var');
      }
      const validTokenExpiryMilliseconds: number = parseInt(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_VALID_DURATION_MS,
        10,
      );

      setCookie('session_token', access_token, {
        // httpOnly: true,
        priority: 'high',
        path: '/',
        maxAge: validTokenExpiryMilliseconds,
      });

      setToast({
        showToast: true,
        toastMessage: 'Berhasil mendaftar',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });

      navigateToDashboard();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      const appError = error?.message;
      setToast({
        showToast: true,
        toastMessage: errorMessage
          ? errorMessage
          : appError
            ? appError
            : 'Login gagal',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  const handleSignUpDoctor = async () => {
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

    if (!selectedOption) {
      setToast({
        showToast: true,
        toastMessage: 'Anda belum memilih spesialisasi',
        toastType: 'warning',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    const payload = new FormData();
    payload.append('email', email);
    payload.append('doctor_specialization_id', selectedOption.toString());
    if (userUpload === undefined) {
      setToast({
        showToast: true,
        toastMessage: 'Anda harus mengunggah sertifikat anda',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      throw new Error('Anda harus mengunggah sertifikat anda');
    }
    payload.append('certificate', userUpload);

    try {
      setIsLoading(true);
      await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/doctors`,
        payload,
      );

      setToast({
        showToast: true,
        toastMessage: 'Berhasil mendaftar. Tolong cek e-mail anda',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });

      navigateToLogin();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      const appError = error?.message;
      setToast({
        showToast: true,
        toastMessage: errorMessage
          ? errorMessage
          : appError
            ? appError
            : 'Pendaftaran gagal',
        toastType: 'error',
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

  useEffect(() => {
    const getAllSpecializations = async () => {
      try {
        const response = await Axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctor-specializations`,
        );

        const doctorSpecializations: Array<DoctorSpecializationsType> = [];
        response.data.data.map((specialization: DoctorSpecializationsType) => {
          doctorSpecializations.push(specialization);
        });
        setSpecializations(doctorSpecializations);
      } catch (error) {
        console.error(error);
        setToast({
          showToast: true,
          toastMessage: 'Error mengambil data spesialisasi',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
      }
    };

    getAllSpecializations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        disabled={isLoading ? true : false}
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
