import PasswordInput from '@/components/atoms/input/PasswordInput';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { PasswordModalContentContainer } from '@/styles/organisms/modal/modalContent/ChangePasswordModalContent.styles';

const ChangePasswordModalContent = (): React.ReactElement => {
  const {
    // password,
    // confirmPassword,
    // passwordValidationError,
    confirmPasswordValidationError,
    // handlePasswordInputChange,
    handleConfirmPasswordInputChange,
  } = usePasswordValidation();
  return (
    <PasswordModalContentContainer>
      <PasswordInput
        defaultValue=''
        validationMessage={confirmPasswordValidationError}
        onChange={handleConfirmPasswordInputChange}
        title=''
        placeholder=''
        $height={60}
        $viewBox='0 0 22 22'
        $viewBoxHide='0 2 22 22'
      />
    </PasswordModalContentContainer>
  );
};

export default ChangePasswordModalContent;
