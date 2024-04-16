'use client';
import React, { useState } from 'react';
import { debounce } from '@/utils/debounce';
import { navigateToHome, navigateToRegister } from './actions';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  RememberAndForgetDiv,
  RememberMeDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/Auth.styles';
import RegularInput from '@/components/RegularInput';
import PasswordInput from '@/components/PasswordInput';
import CustomButton from '@/components/CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';
import { useToast } from '@/app/toast-provider';

const LoginPage = (): React.ReactElement => {
  const { setToast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [emailValidationError, setEmailValidationError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordValidationError, setPasswordValidationError] =
    useState<string>('');

  const validateEmail = (input: string) => {
    const sanitizedInput = input.trim();

    if (input.length < 3) {
      setEmailValidationError('E-mail must be longer than 3 characters');
      return false;
    }

    if (!/^[\w-.]+(\+[\w-]+)?@([\w-]+\.)+[\w-]{2,4}$/.test(sanitizedInput)) {
      setEmailValidationError('Invalid e-mail format');
      return false;
    }

    setEmailValidationError('');
    return true;
  };

  const validatePassword = (input: string) => {
    const sanitizedInput = input.trim();

    if (sanitizedInput.length < 6) {
      setPasswordValidationError('Password must be longer than 6 characters');
      return false;
    }

    setPasswordValidationError('');
    return true;
  };

  const handleEmailInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      validateEmail(event.target.value);
    },
    750,
  );

  const handlePasswordInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      validatePassword(event.target.value);
    },
    750,
  );

  const handleLogin = () => {
    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password);

    if (!isValidEmail || !isValidPassword) {
      setToast({
        showToast: true,
        toastMessage: 'login failed',
        toastType: 'error',
        resolution: 'desktop',
        orientation: 'center',
      });
      return;
    }

    setToast({
      showToast: true,
      toastMessage: 'successfully logged in',
      toastType: 'ok',
      resolution: 'desktop',
      orientation: 'center',
    });
    navigateToHome();
  };

  return (
    <LoginOrRegisterFormContainer>
      <h1>Log In</h1>

      <CreateOrLoginSpan>
        <p>Don&apos;t have an account?</p>
        <u onClick={() => navigateToRegister()}>Create now</u>
      </CreateOrLoginSpan>

      <RegularInput
        title='E-mail'
        placeholder='E-mail'
        onChange={handleEmailInputChange}
        validationMessage={emailValidationError}
      />

      <PasswordInput
        title='Password'
        placeholder='Password'
        onChange={handlePasswordInputChange}
        validationMessage={passwordValidationError}
      />

      <RememberAndForgetDiv>
        <RememberMeDiv>
          <input type='checkbox' name='remember-me' id='remember-me' />
          <p>Remember Me</p>
        </RememberMeDiv>

        <u>Forgot Password?</u>
      </RememberAndForgetDiv>

      <CustomButton content='Sign In' onClick={handleLogin} />

      <SectionSeparator>
        <SeparatorLine />
        OR
        <SeparatorLine />
      </SectionSeparator>

      <OAuthDiv>
        <GoogleICO />
        <p>Continue With Google</p>
      </OAuthDiv>
    </LoginOrRegisterFormContainer>
  );
};

export default LoginPage;
