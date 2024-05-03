'use client';
import {
  LoaderDiv,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  ReturnHomeContainerDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/pages/auth/Auth.styles';
import { useToast } from '@/hooks/useToast';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { navigateToLogin } from '@/app/actions';
import { useSearchParams } from 'next/navigation';
import { useObatinDispatch } from '@/redux/store/store';
import { useState } from 'react';
import { deleteCookie } from 'cookies-next';
import { resetAuthState } from '@/redux/reducers/authSlice';
import { resetAuthDoctorState } from '@/redux/reducers/authDoctorSlice';
import { PropagateLoader } from 'react-spinners';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import CustomButton from '@/components/atoms/button/CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';
import Axios from 'axios';
import LeftArrowICO from '@/assets/arrows/LeftArrowICO';

const ResetPasswordForm = (): React.ReactElement => {
  const { setToast } = useToast();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const searchParams = useSearchParams();
  const dispatch = useObatinDispatch();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const handleResetPassword = async () => {
    const isValidPassword = validatePassword(password);
    const isValidConfimPassword = validateConfirmPassword(confirmPassword);

    if (!isValidPassword || !isValidConfimPassword) {
      setToast({
        showToast: true,
        toastMessage: 'Gagal merubah kata sandi',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      return;
    }

    const payload = {
      password: password,
      confirm_password: confirmPassword,
    };

    try {
      setIsLoading(true);
      await Axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset?token=${token}`,
        payload,
      );

      localStorage.clear();
      deleteCookie('access_token');
      deleteCookie('refresh_token');
      dispatch(resetAuthState());
      dispatch(resetAuthDoctorState());

      setToast({
        showToast: true,
        toastMessage: 'Berhasil. Silahkan login dengan sandi baru',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      navigateToLogin();
    } catch (error: any) {
      if (error?.response?.data?.message === 'token has expired') {
        setToast({
          showToast: true,
          toastMessage:
            'Token sudah tidak berlaku, silahkan membuat pengajuan baru',
          toastType: 'error',
          resolution: isDesktopDisplay ? 'desktop' : 'mobile',
          orientation: 'center',
        });
        return;
      }
      setToast({
        showToast: true,
        toastMessage: 'Gagal merubah kata sandi',
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
      <h1>Atur Ulang Sandi</h1>

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
          content='Ubah Sandi'
          onClick={handleResetPassword}
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

      <ReturnHomeContainerDiv>
        <span onClick={() => navigateToLogin()}>
          <LeftArrowICO />
          Kembali Ke Login
        </span>
      </ReturnHomeContainerDiv>
    </LoginOrRegisterFormContainer>
  );
};

export default ResetPasswordForm;
