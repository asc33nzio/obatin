'use client';
import HidePasswordICO from '@/assets/passwordInput/HidePasswordICO';
import ShowPasswordICO from '@/assets/passwordInput/ShowPasswordICO';
import {
  PasswordCustomInput,
  PasswordInputErrorDiv,
  PasswordInputContainer,
  PasswordInputSubcontainer,
  ICOdiv,
} from '@/styles/PasswordInput.styles';
import React, { InputHTMLAttributes, useState } from 'react';

interface PasswordInputItf extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  title?: string;
  validationMessage?: string;
}

const PasswordInput = ({
  title = 'Default input label',
  validationMessage = 'Default error message',
  ...props
}: PasswordInputItf): React.ReactElement => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <PasswordInputContainer>
      {title}

      <PasswordInputSubcontainer>
        <PasswordCustomInput
          type={isPasswordVisible ? 'text' : 'password'}
          $hasError={validationMessage !== '' ? true : false}
          {...props}
        />
        <ICOdiv $hasError={validationMessage !== '' ? true : false}>
          <div onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            {!isPasswordVisible ? <ShowPasswordICO /> : <HidePasswordICO />}
          </div>
        </ICOdiv>
      </PasswordInputSubcontainer>

      <PasswordInputErrorDiv
        $hasError={validationMessage !== '' ? true : false}
      >
        {validationMessage}
      </PasswordInputErrorDiv>
    </PasswordInputContainer>
  );
};

export default PasswordInput;
