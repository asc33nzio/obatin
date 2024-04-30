import {
  PasswordModalButtonsContainer,
  PasswordModalContentContainer,
} from '@/styles/organisms/modal/modalContent/PasswordModalContent.styles';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/atoms/button/CustomButton';
import PasswordInput from '@/components/atoms/input/PasswordInput';

const ChangePasswordModalContent = (): React.ReactElement => {
  const { setToast } = useToast();
  const { closeModal } = useModal();
  const { isDesktopDisplay } = useClientDisplayResolution();
  const { confirmPasswordValidationError, handleConfirmPasswordInputChange } =
    usePasswordValidation();

  return (
    <PasswordModalContentContainer>
      <PasswordInput
        validationMessage={confirmPasswordValidationError}
        onChange={handleConfirmPasswordInputChange}
        title=''
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
          onClick={() => {
            if (confirmPasswordValidationError) {
              closeModal();
              setToast({
                showToast: true,
                toastMessage: 'Cek kembali kata sandi anda',
                toastType: 'error',
                resolution: isDesktopDisplay ? 'desktop' : 'mobile',
                orientation: 'center',
              });
              return;
            }

            closeModal();
            setToast({
              showToast: true,
              toastMessage:
                'Kata sandi tersimpan. Klik simpan profil untuk menyelesaikan pengubahan',
              toastType: 'ok',
              resolution: isDesktopDisplay ? 'desktop' : 'mobile',
              orientation: 'center',
            });
          }}
        />
      </PasswordModalButtonsContainer>
    </PasswordModalContentContainer>
  );
};

export default ChangePasswordModalContent;
