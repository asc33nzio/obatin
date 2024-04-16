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
}

const RegularInput = ({
  title = 'Default input label',
  validationMessage = 'Default error message',
  ...props
}: RegularInputItf): React.ReactElement => {
  return (
    <RegularInputContainer>
      {title}
      <RegularCustomInput {...props} />
      <RegularInputErrorDiv $hasError={validationMessage !== '' ? true : false}>
        {validationMessage}
      </RegularInputErrorDiv>
    </RegularInputContainer>
  );
};

export default RegularInput;
