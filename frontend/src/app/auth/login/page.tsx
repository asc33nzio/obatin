'use client';
import React, { useState } from 'react';
import RegularInput from '@/components/RegularInput';
import PasswordInput from '@/components/PasswordInput';
import { CreateOrLoginSpan, LoginFormContainer } from '@/styles/Auth';

const Page = (): React.ReactElement => {
  // const [email, setEmail] = useState<string>("");
	const [emailValidationError, setEmailValidationError] = useState<string>("Example validation error");
	// const [password, setPassword] = useState<string>("");
	const [passwordValidationError, setPasswordValidationError] = useState<string>("Example password validation error");

  return (
    <LoginFormContainer>
      <h1>Log In</h1>

      <CreateOrLoginSpan>
        <p>Don&apos;t have an account?</p>
        <u>Create now</u>
      </CreateOrLoginSpan>

      <RegularInput title='E-mail' placeholder='E-mail' validationMessage={emailValidationError}/>
      
      <PasswordInput title='Password' placeholder='Password' validationMessage={passwordValidationError}/>
    </LoginFormContainer>
  );
};

export default Page;
