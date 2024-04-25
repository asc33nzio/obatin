import { Dispatch, SetStateAction } from 'react';

export interface PasswordValidationItf {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  validatePassword: (input: string) => boolean;
  passwordValidationError: string;
  setPasswordValidationError: Dispatch<SetStateAction<string>>;
  handlePasswordInputChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  validateConfirmPassword: (input: string) => boolean;
  confirmPasswordValidationError: string;
  setConfirmPasswordValidationError: Dispatch<SetStateAction<string>>;
  handleConfirmPasswordInputChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}
