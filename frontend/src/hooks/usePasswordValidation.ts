import { debounce } from '@/utils/debounce';
import { useState } from 'react';

export const usePasswordValidation = () => {
  const [password, setPassword] = useState<string>('');
  const [passwordValidationError, setPasswordValidationError] =
    useState<string>('');

  const validatePassword = (input: string) => {
    const sanitizedInput = input.trim();

    if (sanitizedInput.length < 6) {
      setPasswordValidationError('Sandi harus lebih dari 6 karakter');
      return false;
    }

    setPasswordValidationError('');
    return true;
  };

  const handlePasswordInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      validatePassword(event.target.value);
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
  };
};
