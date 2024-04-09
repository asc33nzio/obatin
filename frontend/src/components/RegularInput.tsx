import {
  RegularCustomInput,
  RegularInputErrorDiv,
  RegularInputContainer,
} from '@/styles/RegularInput';
import React from 'react';

const RegularInput = (props: {
  title: string;
  placeholder: string;
  validationMessage?: string;
}): React.ReactElement => {
  return (
    <RegularInputContainer>
      {props.title}
      <RegularCustomInput placeholder={props.placeholder} />
      <RegularInputErrorDiv
        $hasError={props.validationMessage !== "" ? true : false}
      >
        {props?.validationMessage}
      </RegularInputErrorDiv>
    </RegularInputContainer>
  );
};

export default RegularInput;
