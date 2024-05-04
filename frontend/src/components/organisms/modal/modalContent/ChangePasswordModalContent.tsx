import {
  PasswordModalButtonsContainer,
  PasswordModalContentContainer,
} from '@/styles/organisms/modal/modalContent/PasswordModalContent.styles';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import CustomButton from '@/components/atoms/button/CustomButton';
import PasswordInput from '@/components/atoms/input/PasswordInput';
import Axios from 'axios';

const ChangePasswordModalContent = (): React.ReactElement => {
  const accessToken = getCookie('access_token');
  const { setToast } = useToast();
  const { closeModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const {
    password,
    passwordValidationError,
    handlePasswordInputChange,
    confirmPassword,
    confirmPasswordValidationError,
    handleConfirmPasswordInputChange,
  } = usePasswordValidation();
  const [oldPassword, setOldPassword] = useState<string>('');

  const handleUpdatePassword = async () => {
    if (oldPassword === confirmPassword) {
      setToast({
        showToast: true,
        toastMessage: 'Sandi baru anda tidak boleh sama dengan sandi lama',
        toastType: 'warning',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      closeModal();
      return;
    }

    if (passwordValidationError || confirmPasswordValidationError) {
      setToast({
        showToast: true,
        toastMessage: 'Cek kembali kata sandi anda',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      closeModal();
      return;
    }

    const payload = {
      old_password: oldPassword,
      new_password: confirmPassword,
    };

    try {
      await Axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setToast({
        showToast: true,
        toastMessage: 'Kata sandi anda terbaharui',
        toastType: 'ok',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
      closeModal();
    } catch (error) {
      console.error(error);
      setToast({
        showToast: true,
        toastMessage: 'Maaf, tolong coba kembali',
        toastType: 'error',
        resolution: isDesktopDisplay ? 'desktop' : 'mobile',
        orientation: 'center',
      });
    }
  };

  useEffect(() => {
    setOldPassword(password);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PasswordModalContentContainer>
      <PasswordInput
        validationMessage={passwordValidationError}
        onChange={handlePasswordInputChange}
        title='Kata Sandi'
        placeholder=''
        $height={75}
        $marBot={0}
      />
      <PasswordInput
        validationMessage={confirmPasswordValidationError}
        onChange={handleConfirmPasswordInputChange}
        title='Konfirmasi Kata Sandi'
        placeholder=''
        $height={75}
        $marBot={0}
      />

      <PasswordModalButtonsContainer>
        <CustomButton
          content='Batal'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          $bgColor='#de161c'
          onClick={() => {
            closeModal();
            setToast({
              showToast: true,
              toastMessage: 'Tidak ada perubahan',
              toastType: 'warning',
              resolution: isDesktopDisplay ? 'desktop' : 'mobile',
              orientation: 'center',
            });
          }}
        />
        <CustomButton
          content='Konfirmasi'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          onClick={handleUpdatePassword}
        />
      </PasswordModalButtonsContainer>
    </PasswordModalContentContainer>
  );
};

export default ChangePasswordModalContent;
