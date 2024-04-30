import {
  PasswordModalButtonsContainer,
  PasswordModalContentContainer,
} from '@/styles/organisms/modal/modalContent/PasswordModalContent.styles';
import { useClientDisplayResolution } from '@/hooks/useClientDisplayResolution';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useEventEmitter } from '@/hooks/useEventEmitter';
import { useModal } from '@/hooks/useModal';
import { useToast } from '@/hooks/useToast';
import CustomButton from '@/components/atoms/button/CustomButton';
import PasswordInput from '@/components/atoms/input/PasswordInput';

const RegisterConfirmPasswordModalContent = (): React.ReactElement => {
  const emitter = useEventEmitter();
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
            emitter.emit('close-modal-fail');
            closeModal();

            setToast({
              showToast: true,
              toastMessage: 'Pendaftaran dibatalkan',
              toastType: 'warning',
              resolution: isDesktopDisplay ? 'desktop' : 'mobile',
              orientation: 'center',
            });
          }}
        />
        <CustomButton
          content='Lanjutkan'
          $width='150px'
          $height='50px'
          $fontSize='22px'
          onClick={() => {
            if (confirmPasswordValidationError) {
              emitter.emit('close-modal-fail');
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

            emitter.emit('close-modal-ok');
            closeModal();
          }}
        />
      </PasswordModalButtonsContainer>
    </PasswordModalContentContainer>
  );
};

export default RegisterConfirmPasswordModalContent;
