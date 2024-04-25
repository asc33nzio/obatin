'use client';
import {
  PasswordCustomInput,
  PasswordInputErrorDiv,
  PasswordInputContainer,
  PasswordInputSubcontainer,
  ICOdiv,
} from '@/styles/atoms/PasswordInput.styles';
import { InputHTMLAttributes, useState } from 'react';
import HidePasswordICO from '@/assets/passwordInput/HidePasswordICO';
import ShowPasswordICO from '@/assets/passwordInput/ShowPasswordICO';

interface PasswordInputItf extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  title?: string;
  validationMessage?: string;
  $viewBox?: string | undefined;
  $viewBoxHide?: string | undefined;
  $height?: number | undefined;
  $marBot?: number | undefined;
}

const PasswordInput = ({
  title = 'Default input label',
  validationMessage = 'Default error message',
  $height = 100,
  $marBot = 25,
  ...props
}: PasswordInputItf): React.ReactElement => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <PasswordInputContainer $height={$height} $marBot={$marBot}>
      {title}

      <PasswordInputSubcontainer>
        <PasswordCustomInput
          type={isPasswordVisible ? 'text' : 'password'}
          $hasError={validationMessage !== '' ? true : false}
          {...props}
        />
        <ICOdiv $hasError={validationMessage !== '' ? true : false}>
          <div onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            {!isPasswordVisible ? (
              <ShowPasswordICO
                $viewBox={props.$viewBox ? props.$viewBox : '0 0 22 22'}
              />
            ) : (
              <HidePasswordICO
                $viewBoxHide={
                  props.$viewBoxHide ? props.$viewBoxHide : '0 -2 22 22'
                }
              />
            )}
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
