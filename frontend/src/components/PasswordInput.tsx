'use client';
import {
  PasswordCustomInput,
  PasswordInputErrorDiv,
  PasswordInputContainer,
  PasswordInputSubcontainer,
} from '@/styles/PasswordInput';
import { ImEye } from 'react-icons/im';
import React from 'react';

const PasswordInput = (props: {
  title: string;
  placeholder: string;
  validationMessage?: string;
}): React.ReactElement => {
  return (
    <PasswordInputContainer>
      {props.title}

      <PasswordInputSubcontainer>
        <PasswordCustomInput placeholder={props.placeholder} />
        {/* <ImEye
          size={30}
          key={'ImEyeIcon'}
          id='imeyeicon'
        /> */}
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
