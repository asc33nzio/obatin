'use client';
import {
  CreateOrLoginSpan,
  LoaderDiv,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  RememberAndForgetDiv,
  RememberMeDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/pages/auth/Auth.styles';
import {
  navigateToUserDashboard,
  navigateToDoctorDashboard,
  navigateToForgotPassword,
  navigateToRegister,
} from '@/app/actions';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useObatinDispatch } from '@/redux/store/store';
import { useState } from 'react';
import { setCookie } from 'cookies-next';
import { setAuthState } from '@/redux/reducers/authSlice';
import { jwtDecode } from 'jwt-decode';
import { DecodedJwtItf } from '@/types/jwtTypes';
import { PropagateLoader } from 'react-spinners';
import Axios from 'axios';
import RegularInput from '@/components/atoms/input/RegularInput';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import CustomButton from '@/components/atoms/button/CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';

const LoginForm = (): React.ReactElement => {
  const dispatch = useObatinDispatch();
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const { email, validateEmail, emailValidationError, handleEmailInputChange } =
    useEmailValidation();
  const {
    password,
    validatePassword,
    passwordValidationError,
    handlePasswordInputChange,
  } = usePasswordValidation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password);

    if (!isValidEmail || !isValidPassword) {
      setToast({
        showToast: true,
        toastMessage: 'Login gagal',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    const loginPayload = {
      email: email?.trim(),
      password: password?.trim(),
    };

    try {
      setIsLoading(true);
      const loginResponse = await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        loginPayload,
      );

      const access_token = loginResponse?.data?.data?.access_token;
      const refresh_token = loginResponse?.data?.data?.refresh_token;
      const decoded: DecodedJwtItf = jwtDecode(access_token);
      const userRole = decoded.Payload.role;
      const authId = decoded.Payload.aid;
      const isVerified = decoded.Payload.is_verified;
      const isApproved = decoded.Payload.is_approved;

      if (process.env.NEXT_PUBLIC_ACCESS_TOKEN_VALID_DURATION_S === undefined) {
        throw new Error('please define access token valid duration env var');
      }
      const validAccessTokenExpiryMilliseconds: number = parseInt(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_VALID_DURATION_S,
        10,
      );
      if (
        process.env.NEXT_PUBLIC_REFRESH_TOKEN_VALID_DURATION_S === undefined
      ) {
        throw new Error('please define refresh token valid duration env var');
      }
      const validRefreshTokenExpiryMilliseconds: number = parseInt(
        process.env.NEXT_PUBLIC_REFRESH_TOKEN_VALID_DURATION_S,
        10,
      );

      setCookie('access_token', access_token, {
        // httpOnly: true,
        priority: 'high',
        path: '/',
        maxAge: validAccessTokenExpiryMilliseconds,
      });

      setCookie('refresh_token', refresh_token, {
        // httpOnly: true,
        priority: 'high',
        path: '/',
        maxAge: validRefreshTokenExpiryMilliseconds,
      });

      if (userRole === 'user') {
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
            activeAddressId: userData.active_address_id,
            addresses: userData.addresses,
          }),
        );

        navigateToUserDashboard();
      }

      if (userRole === 'doctor') {
        const doctorDetailResponse = await Axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${authId}`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          },
        );

        const doctorData = doctorDetailResponse.data.data;
        dispatch(
          setAuthState({
            aid: authId,
            email: doctorData.email,
            name: doctorData.name,
            gender: doctorData.gender,
            birthDate: doctorData.birth_date,
            role: userRole,
            avatarUrl: doctorData.avatar_url,
            isVerified: isVerified,
            isApproved: isApproved,
            specialization: doctorData.specialization,
          }),
        );

        navigateToDoctorDashboard();
      }

      setToast({
        showToast: true,
        toastMessage: 'Login berhasil',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginOrRegisterFormContainer $isLoginPage={true}>
      <h1>Selamat Datang!</h1>

      <CreateOrLoginSpan $marBot={25}>
        <p>Baru di ObatIn?</p>
        <u onClick={() => navigateToRegister()}>Daftar Sekarang</u>
      </CreateOrLoginSpan>

      <RegularInput
        title='E-mail'
        placeholder='E-mail'
        onChange={handleEmailInputChange}
        validationMessage={emailValidationError}
        $marBot={25}
        onKeyDown={(e) => (e.key === 'Enter' ? handleLogin() : null)}
      />

      <PasswordInput
        title='Kata Sandi'
        placeholder='Kata Sandi'
        onChange={handlePasswordInputChange}
        validationMessage={passwordValidationError}
        $viewBox='0 -2 22 22'
        $viewBoxHide='0 0 22 22'
        onKeyDown={(e) => (e.key === 'Enter' ? handleLogin() : null)}
      />

      <RememberAndForgetDiv>
        <RememberMeDiv>
          <input type='checkbox' name='remember-me' id='remember-me' />
          <p>Ingat Saya</p>
        </RememberMeDiv>

        <u onClick={() => navigateToForgotPassword()}>Lupa Kata Sandi?</u>
      </RememberAndForgetDiv>

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
          content='Log In'
          onClick={handleLogin}
          disabled={isLoading}
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

export default LoginForm;
