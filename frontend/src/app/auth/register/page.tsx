'use client';
import React, { useState } from 'react';
import { navigateToLogin, navigateToSetPassword } from './actions';
import { debounce } from '@/utils/debounce';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/Auth.styles';
import RegularInput from '@/components/RegularInput';
import CustomButton from '@/components/CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';

const RegisterPage = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [emailValidationError, setEmailValidationError] = useState<string>('');

  const validateEmail = (input: string) => {
    if (input.length < 3) {
      setEmailValidationError('E-mail must be longer than 3 characters');
      return false;
    }

    setEmailValidationError('');
    return true;
  };

  const handleEmailInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
      validateEmail(event.target.value);
    },
    750,
  );

  const handleSignUp = () => {
    const isValidEmail = validateEmail(email);

    if (!isValidEmail) {
      return;
    }

    navigateToSetPassword();
  };

  return (
    <LoginOrRegisterFormContainer>
      <h1>Register</h1>

      <CreateOrLoginSpan>
        <p>Already have an account?</p>
        <u onClick={() => navigateToLogin()}>Login Here</u>
      </CreateOrLoginSpan>

      <RegularInput
        title='E-mail'
        placeholder='E-mail'
        validationMessage={emailValidationError}
        onChange={handleEmailInputChange}
      />

      <CustomButton content='Sign Up' onClick={handleSignUp} />

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

export default RegisterPage;
