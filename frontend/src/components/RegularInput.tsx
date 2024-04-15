import {
  RegularCustomInput,
  RegularInputErrorDiv,
  RegularInputContainer,
} from '@/styles/RegularInput';
import { debounce } from '@/utils/debounce';
import React from 'react';

const RegularInput = (props: {
  title: string;
  placeholder: string;
  validationFunction: any;
  validationMessage?: string;
}): React.ReactElement => {
  const handleInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.validationFunction(event.target.value);
    },
    750,
  );

  return (
    <RegularInputContainer>
      {props.title}
      <RegularCustomInput
        placeholder={props.placeholder}
        onChange={handleInputChange}
      />
      <RegularInputErrorDiv
        $hasError={props.validationMessage !== '' ? true : false}
      >
        {props?.validationMessage}
      </RegularInputErrorDiv>
    </RegularInputContainer>
  );
};

export default RegularInput;
