import { useContext } from 'react';
import { PasswordValidationItf } from '@/types/passwordValidationTypes';
import PasswordValidationContext from '@/contexts/passwordValidationContext';

export const usePasswordValidation = (): PasswordValidationItf => {
  const context = useContext(PasswordValidationContext);
  if (!context) {
    throw new Error('PasswordValidation context missing!');
  }

  return context;
};
