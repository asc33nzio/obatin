'use client';
import {
  CreateOrLoginSpan,
  LoaderDiv,
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
import { useUploadValidation } from '@/hooks/useUploadValidation';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { setCookie } from 'cookies-next';
import { DoctorSpecializationsType } from '@/types/registerTypes';
import { navigateToUserDashboard, navigateToLogin } from '@/app/actions';
import { PropagateLoader } from 'react-spinners';
import { useObatinDispatch } from '@/redux/store/store';
import { setAuthState } from '@/redux/reducers/authSlice';
import { DecodedJwtItf } from '@/types/jwtTypes';
import { jwtDecode } from 'jwt-decode';
import RegularInput from '@/components/atoms/input/RegularInput';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import CustomButton from '@/components/atoms/button/CustomButton';
import SpecializationSelect from '@/components/atoms/select/SpecializationSelect';
import GoogleICO from '@/assets/icons/GoogleICO';
import PatientICO from '@/assets/auth/PatientICO';
import DoctorICO from '@/assets/auth/DoctorICO';
import Axios from 'axios';

const RegisterForm = (): React.ReactElement => {
  const emitter = useEventEmitter();
  const dispatch = useObatinDispatch();
  const { setToast } = useToast();
  const { openModal } = useModal();
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
  const {
    userUpload,
    setUserUpload,
    userUploadValidationError,
    setUserUploadValidationError,
    validatePdfUpload,
    handlePdfChange,
  } = useUploadValidation();
  const [isDoctor, setIsDoctor] = useState<boolean>(false);
  const [specializations, setSpecializations] = useState<
    Array<DoctorSpecializationsType>
  >([]);
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    const performModalAction = async () => {
      return new Promise<boolean>((resolve) => {
        openModal('confirm-password-register');

        emitter.once('close-modal-fail', () => {
          resolve(false);
        });

        emitter.once('close-modal-ok', () => {
          resolve(true);
        });
      });
    };

    try {
      setIsLoading(true);

      const validPasswordConfirmation = await performModalAction();
      if (!validPasswordConfirmation)
        throw new Error('Konfirmasi salah, mohon cek kembali');

      await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/users`,
        payload,
      );

      const autoLoginResponse = await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        payload,
      );

      const access_token = autoLoginResponse?.data?.data?.access_token;
      const refresh_token = autoLoginResponse?.data?.data?.refresh_token;
      const decoded: DecodedJwtItf = jwtDecode(access_token);
      const userRole = decoded.Payload.role;
      const authId = decoded.Payload.aid;
      const isVerified = decoded.Payload.is_verified;
      const isApproved = decoded.Payload.is_approved;

      setCookie('access_token', access_token, {
        priority: 'high',
        path: '/',
      });

      setCookie('refresh_token', refresh_token, {
        priority: 'high',
        path: '/',
      });

      const userDetailResponse = await Axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${authId}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      const userData = userDetailResponse.data.data;
      dispatch(
        setAuthState({
          aid: authId,
          email: userData.email,
          name: userData.name,
          gender: userData.gender,
          birthDate: userData.birth_date,
          role: userRole,
          avatarUrl: userData.avatar_url,
          isVerified: isVerified,
          isApproved: isApproved,
        }),
      );

      setToast({
        showToast: true,
        toastMessage: 'Berhasil mendaftar',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });

      navigateToUserDashboard();
    } catch (error: any) {
      console.log(error);
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

  const handleSignUpDoctor = async () => {
    const isValidEmail = validateEmail(email);
    const isValidUpload = validatePdfUpload(userUpload);

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
        toastMessage: 'Silahkan cek e-mail anda untuk mendapatkan kata sandi',
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
            onKeyDown={(e) => (e.key === 'Enter' ? handleSignUpDoctor() : null)}
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
            onChange={handlePdfChange}
            $marBot={15}
            accept='image/*,.pdf'
            $isSet={userUpload !== undefined}
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
            onKeyDown={(e) =>
              e.key === 'Enter' ? handleSignUpPatient() : null
            }
          />
          <PasswordInput
            title='Kata Sandi'
            placeholder='Kata Sandi'
            onChange={handlePasswordInputChange}
            validationMessage={passwordValidationError}
            $viewBox='0 -2 22 22'
            $viewBoxHide='0 0 22 22'
            onKeyDown={(e) =>
              e.key === 'Enter' ? handleSignUpPatient() : null
            }
          />
        </>
      )}

      {isLoading ? (
        <LoaderDiv>
          <PropagateLoader
            color='#dd1b50'
            speedMultiplier={0.8}
            size={'18px'}
            cssOverride={{
              alignSelf: 'center',
              justifySelf: 'center',
            }}
          />
        </LoaderDiv>
      ) : (
        <CustomButton
          content='Lanjutkan'
          onClick={
            isDoctor ? () => handleSignUpDoctor() : () => handleSignUpPatient()
          }
          disabled={isLoading ? true : false}
        />
      )}

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
