'use client';
import React, { useState } from 'react';
import RegularInput from '@/components/RegularInput';
import PasswordInput from '@/components/PasswordInput';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  RememberAndForgetDiv,
  RememberMeDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/Auth';
import CustomButton from '@/components/CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';

const Page = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [emailValidationError, setEmailValidationError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordValidationError, setPasswordValidationError] =
    useState<string>('');

  const handleEmailValidation = (input: string) => {
    setEmail(input);

    if (input.length < 3) {
      setEmailValidationError('E-mail must be longer than 3 characters');
      return;
    }

    setEmailValidationError('');
  };

  const handlePasswordValidation = (input: string) => {
    setPassword(input);

    if (input.length < 6) {
      setPasswordValidationError('Password must be longer than 6 characters');
      return;
    }

    setPasswordValidationError('');
  };

  return (
    <LoginOrRegisterFormContainer>
      <h1>Log In</h1>

      <CreateOrLoginSpan>
        <p>Don&apos;t have an account?</p>
        <u>Create now</u>
      </CreateOrLoginSpan>

      <RegularInput
        title='E-mail'
        placeholder='E-mail'
        validationFunction={handleEmailValidation}
        validationMessage={emailValidationError}
      />

      <PasswordInput
        title='Password'
        placeholder='Password'
        validationFunction={handlePasswordValidation}
        validationMessage={passwordValidationError}
      />

      <RememberAndForgetDiv>
        <RememberMeDiv>
          <input type='checkbox' name='remember-me' id='remember-me' />
          <p>Remember Me</p>
        </RememberMeDiv>

        <u>Forgot Password?</u>
      </RememberAndForgetDiv>

      <CustomButton content='Sign In' />

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

export default Page;
