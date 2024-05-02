'use client';
import {
  LoginOrRegisterFormContainer,
  OAuthDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/pages/auth/Auth.styles';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { navigateToDoctorDashboard } from '@/app/actions';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import CustomButton from '@/components/atoms/button/CustomButton';
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

  const handleSetNewPassword = () => {
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

    try {
      setToast({
        showToast: true,
        toastMessage: 'Berhasil mendaftar',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      navigateToDoctorDashboard();
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Gagal mengatur kata sandi',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  return (
    <LoginOrRegisterFormContainer $isLoginPage={true}>
      <h1>Buat Kata Sandi</h1>

      <PasswordInput
        title='Kata Sandi'
        placeholder='Kata Sandi'
        onChange={handlePasswordInputChange}
        validationMessage={passwordValidationError}
        $viewBox='0 -2 22 22'
      />

      <PasswordInput
        title='Konfirmasi Kata Sandi'
        placeholder='Konfirmasi Kata Sandi'
        onChange={handleConfirmPasswordInputChange}
        validationMessage={confirmPasswordValidationError}
        $viewBox='0 -2 22 22'
      />

      <CustomButton content='Ubah Sandi' onClick={handleSetNewPassword} />

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
