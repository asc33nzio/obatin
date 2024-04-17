import {
  RegularCustomInput,
  RegularInputErrorDiv,
  RegularInputContainer,
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
      <RegularInputErrorDiv $hasError={validationMessage !== '' ? true : false}>
        {validationMessage}
      </RegularInputErrorDiv>
    </RegularInputContainer>
  );
};

export default RegularInput;
