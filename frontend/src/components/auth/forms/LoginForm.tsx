'use client';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  RememberAndForgetDiv,
  RememberMeDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/Auth.styles';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { useEmailValidation } from '@/hooks/useEmailValidation';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import {
  navigateToForgotPassword,
  navigateToHome,
  navigateToRegister,
} from '@/app/auth/actions';
import RegularInput from '../RegularInput';
import PasswordInput from '../PasswordInput';
import CustomButton from '../CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';

const LoginForm = (): React.ReactElement => {
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

  const handleLogin = () => {
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

    //? POST request

    setToast({
      showToast: true,
      toastMessage: 'Login berhasil',
      toastType: 'ok',
      resolution: isDesktopDisplay ? 'desktop' : 'mobile',
      orientation: 'center',
    });
    navigateToHome();
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
      />

      <PasswordInput
        title='Kata Sandi'
        placeholder='Kata Sandi'
        onChange={handlePasswordInputChange}
        validationMessage={passwordValidationError}
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
