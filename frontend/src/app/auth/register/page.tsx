'use client';
import React, { useEffect, useState } from 'react';
import RegularInput from '@/components/RegularInput';
import {
  CreateOrLoginSpan,
  LoginOrRegisterFormContainer,
  OAuthDiv,
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

	useEffect(() => {
		const handleResize = () => {
			setIsDesktopDisplay(window.outerWidth > 768);
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

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
        validationMessage={emailValidationError}
      />

      <CustomButton content='Sign Up' />

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
