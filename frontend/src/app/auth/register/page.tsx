'use client';
import React, { useState } from 'react';
import RegularInput from '@/components/RegularInput';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  SectionSeparator,
  SeparatorLine,
} from '@/styles/Auth';
import CustomButton from '@/components/CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';

const Page = (): React.ReactElement => {
  //eslint-disable-next-line
  const [email, setEmail] = useState<string>('');
  const [emailValidationError, setEmailValidationError] = useState<string>('');

  const handleEmailValidation = (input: string) => {
    setEmail(input);

    if (input.length < 3) {
      setEmailValidationError('E-mail must be longer than 3 characters');
      return;
    }

    setEmailValidationError('');
  };

  return (
    <LoginOrRegisterFormContainer>
      <h1>Register</h1>

      <CreateOrLoginSpan>
        <p>Already have an account?</p>
        <u>Login Here</u>
      </CreateOrLoginSpan>

      <RegularInput
        title='E-mail'
        placeholder='E-mail'
        validationFunction={handleEmailValidation}
        validationMessage={emailValidationError}
      />

      <CustomButton content='Sign Up' />

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
