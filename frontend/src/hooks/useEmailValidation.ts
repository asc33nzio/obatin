import { debounce } from '@/utils/debounceThrottle';
import { useState } from 'react';

export const useEmailValidation = () => {
  const [email, setEmail] = useState<string>('');
  const [emailValidationError, setEmailValidationError] = useState<string>('');

  const validateEmail = (input: string) => {
    const sanitizedInput = input.trim();

    if (input.length < 3) {
      setEmailValidationError('E-mail harus lebih dari 3 karakter');
      return false;
    }

    if (!/^[\w-.]+(\+[\w-]+)?@([\w-]+\.)+[\w-]{2,4}$/.test(sanitizedInput)) {
      setEmailValidationError('Pola e-mail tidak sesuai');
      return false;
    }

    setEmailValidationError('');
    return true;
  };

  const handleEmailInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (validateEmail(event.target.value)) {
        setEmail(event.target.value);
      }
    },
    200,
  );

  return {
    email,
    setEmail,
    validateEmail,
    emailValidationError,
    setEmailValidationError,
    handleEmailInputChange,
  };
};
