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
  $width?: number;
  $height?: number;
  $isSet?: boolean;
  $disabled?: boolean;
  $fontSize?: number;
}

const RegularInput = ({
  title = '',
  placeholder = 'Default placeholder',
  validationMessage = 'Default error message',
  $marBot = 0,
  $width = 100,
  $height = 100,
  $isSet = false,
  $disabled = false,
  $fontSize = 18,
  ...props
}: RegularInputItf): React.ReactElement => {
  return (
    <RegularInputContainer $marBot={$marBot} $width={$width} $height={$height}>
      {title}
      <RegularCustomInput
        {...props}
        placeholder={placeholder}
        $hasError={validationMessage !== '' ? true : false}
        disabled={$disabled}
        $disabled={$disabled}
      />
      {props?.type === 'file' && (
        <CustomUploadButton
          $fontSize={$fontSize}
          $hasError={validationMessage !== '' ? true : false}
          $isSet={$isSet}
        >
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
