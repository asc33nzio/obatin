import {
  RegularCustomInput,
  RegularInputErrorDiv,
  RegularInputContainer,
  CustomUploadButton,
} from '@/styles/RegularInput.styles';
import React, { InputHTMLAttributes } from 'react';

interface RegularInputItf extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  title?: string;
  validationMessage?: string;
  $marBot: number;
}

const RegularInput = ({
  title = 'Default input label',
  placeholder = 'Default placeholder',
  validationMessage = 'Default error message',
  $marBot = 0,
  ...props
}: RegularInputItf): React.ReactElement => {
  return (
    <RegularInputContainer $marBot={$marBot}>
      {title}
      <RegularCustomInput
        {...props}
        $hasError={validationMessage !== '' ? true : false}
      />
      {props?.type === 'file' && (
        <CustomUploadButton $hasError={validationMessage !== '' ? true : false}>
          {placeholder}
        </CustomUploadButton>
      )}
      <RegularInputErrorDiv $hasError={validationMessage !== '' ? true : false}>
        {validationMessage}
      </RegularInputErrorDiv>
    </RegularInputContainer>
  );
};

export default RegularInput;
