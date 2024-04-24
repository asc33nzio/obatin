import {
  RegularCustomInput,
  RegularInputErrorDiv,
  RegularInputContainer,
  CustomUploadButton,
} from '@/styles/atoms/RegularInput.styles';
import { InputHTMLAttributes } from 'react';

interface RegularInputItf extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  title?: string;
  validationMessage?: string;
  $marBot?: number;
  $height?: number;
}

const RegularInput = ({
  title = '',
  placeholder = 'Default placeholder',
  validationMessage = 'Default error message',
  $marBot = 0,
  $height = 100,
  ...props
}: RegularInputItf): React.ReactElement => {
  return (
    <RegularInputContainer $marBot={$marBot} $height={$height}>
      {title}
      <RegularCustomInput
        {...props}
        placeholder={placeholder}
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