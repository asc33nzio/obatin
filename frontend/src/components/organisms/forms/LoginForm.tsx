'use client';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  RememberAndForgetDiv,
  RememberMeDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/pages/auth/Auth.styles';
import {
  navigateToDashboard,
  navigateToForgotPassword,
  navigateToRegister,
} from '@/app/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { getCookie, setCookie } from 'cookies-next';
import { useObatinDispatch } from '@/redux/store/store';
import { setAuthState } from '@/redux/reducers/authSlice';
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

    const payload = {
      email: email?.trim(),
      password: password?.trim(),
    };

    try {
      const response = await Axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        payload,
      );

      const access_token = response?.data?.data?.access_token;

      if (process.env.NEXT_PUBLIC_ACCESS_TOKEN_VALID_DURATION_S === undefined) {
        throw new Error('please define access token valid duration env var');
      }
      const validTokenExpiryMilliseconds: number = parseInt(
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_VALID_DURATION_S,
        10,
      );

      setCookie('session_token', access_token, {
        // httpOnly: true,
        priority: 'high',
        path: '/',
        maxAge: validTokenExpiryMilliseconds,
      });

      dispatch(
        setAuthState({
          email: 'example@example.com',
          name: 'John Doe',
          gender: 'laki-laki',
          birthDate: new Date('1970-01-01'),
          specialization: 'Dokter Kelamin',
          role: 'user',
          isVerified: true,
          isApproved: true,
        }),
      );

      setToast({
        showToast: true,
        toastMessage: 'Login berhasil',
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
      />

      <PasswordInput
        title='Kata Sandi'
        placeholder='Kata Sandi'
        onChange={handlePasswordInputChange}
        validationMessage={passwordValidationError}
        $viewBox='0 -2 22 22'
        $viewBoxHide='0 0 22 22'
      />

      <RememberAndForgetDiv>
        <RememberMeDiv>
          <input type='checkbox' name='remember-me' id='remember-me' />
          <p>Ingat Saya</p>
        </RememberMeDiv>

        <u onClick={() => navigateToForgotPassword()}>Lupa Kata Sandi?</u>
      </RememberAndForgetDiv>

      <CustomButton content='Log In' onClick={handleLogin} />

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
