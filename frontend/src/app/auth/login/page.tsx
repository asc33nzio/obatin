'use client';
import React, { useEffect, useState } from 'react';
import RegularInput from '@/components/RegularInput';
import PasswordInput from '@/components/PasswordInput';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
  RememberAndForgetDiv,
  RememberMeDiv,
  SectionSeparator,
} from '@/styles/Auth';
import CustomButton from '@/components/CustomButton';
import GoogleICO from '@/assets/icons/GoogleICO';

const Page = (): React.ReactElement => {
  const [isDesktopDisplay, setIsDesktopDisplay] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [emailValidationError, setEmailValidationError] = useState<string>(
    'Example validation error',
  );
  const [password, setPassword] = useState<string>('');
  const [passwordValidationError, setPasswordValidationError] =
    useState<string>('Example password validation error');
    
  useEffect(() => {
    const handleResize = () => {
      setIsDesktopDisplay(window.outerWidth > 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        validationMessage={emailValidationError}
      />

      <PasswordInput
        title='Password'
        placeholder='Password'
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
        <s>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </s>
        OR
        <s>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </s>
      </SectionSeparator>

      <OAuthDiv>
        <GoogleICO />
        <p>Continue With Google</p>
      </OAuthDiv>
    </LoginOrRegisterFormContainer>
  );
};

export default Page;
