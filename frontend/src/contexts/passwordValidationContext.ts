import { PasswordValidationItf } from '@/types/passwordValidationTypes';
import { createContext } from 'react';

const PasswordValidationContext = createContext<
  PasswordValidationItf | undefined
>(undefined);

export default PasswordValidationContext;
