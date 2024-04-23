import { debounce } from '@/utils/debounce';
import { useState } from 'react';

export const usePasswordValidation = () => {
  const [password, setPassword] = useState<string>('');
  const [passwordValidationError, setPasswordValidationError] =
    useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmPasswordValidationError, setConfirmPasswordValidationError] =
    useState<string>('');

  const validatePassword = (input: string) => {
    const sanitizedInput = input.trim();

    if (sanitizedInput.length < 8) {
      setPasswordValidationError('Sandi harus lebih dari 8 karakter');
      return false;
    }

    setPasswordValidationError('');
    return true;
  };

  const validateConfirmPassword = (input: string) => {
    const sanitizedInput = input.trim();

    if (sanitizedInput.length === 0) {
      setConfirmPasswordValidationError('Konfirmasi sandi tidak boleh kosong');
      return false;
    }

    if (sanitizedInput !== password) {
      setConfirmPasswordValidationError(
        'Konfirmasi sandi tidak sama. Mohon cek kembali',
      );
      return false;
    }

    setConfirmPasswordValidationError('');
    return true;
  };

  const handlePasswordInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (validatePassword(event.target.value)) {
        setPassword(event.target.value);
      }
    },
    750,
  );

  const handleConfirmPasswordInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (validateConfirmPassword(event.target.value)) {
        setConfirmPassword(event.target.value);
      }
    },
    750,
  );

  return {
    password,
    setPassword,
    validatePassword,
    passwordValidationError,
    setPasswordValidationError,
    handlePasswordInputChange,
    confirmPassword,
    setConfirmPassword,
    validateConfirmPassword,
    confirmPasswordValidationError,
    setConfirmPasswordValidationError,
    handleConfirmPasswordInputChange,
  };
};
