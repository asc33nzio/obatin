'use client';
import HidePasswordICO from '@/assets/passwordInput/HidePasswordICO';
import ShowPasswordICO from '@/assets/passwordInput/ShowPasswordICO';
import {
  PasswordCustomInput,
  PasswordInputErrorDiv,
  PasswordInputContainer,
  PasswordInputSubcontainer,
  ICOdiv,
} from '@/styles/PasswordInput';
import React, { useState } from 'react';

const PasswordInput = (props: {
  title: string;
  placeholder: string;
  validationMessage?: string;
}): React.ReactElement => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <PasswordInputContainer>
      {props.title}

      <PasswordInputSubcontainer>
        <PasswordCustomInput
          placeholder={props.placeholder}
          type={isPasswordVisible ? 'text' : 'password'}
        />
        <ICOdiv>
          <div onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            {!isPasswordVisible ? <ShowPasswordICO /> : <HidePasswordICO />}
          </div>
        </ICOdiv>
      </PasswordInputSubcontainer>

      <PasswordInputErrorDiv
        $hasError={props.validationMessage !== '' ? true : false}
      >
        {props?.validationMessage}
      </PasswordInputErrorDiv>
    </PasswordInputContainer>
  );
};

export default PasswordInput;
