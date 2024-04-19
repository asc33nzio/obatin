'use client';
import {
  LoginOrRegisterFormContainer,
  OAuthDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/Auth.styles';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { navigateToHome } from '@/app/auth/actions';
import PasswordInput from '../PasswordInput';
import CustomButton from '../../elements/button/CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';

const SetPasswordForm = (): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const {
    password,
    validatePassword,
    passwordValidationError,
    handlePasswordInputChange,
    confirmPassword,
    validateConfirmPassword,
    confirmPasswordValidationError,
    handleConfirmPasswordInputChange,
  } = usePasswordValidation();

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
