import { debounce } from '@/utils/debounceThrottle';
import { useState } from 'react';

export const useInputValidation = () => {
  const [input, setInput] = useState<string | number | null>(null);
  const [inputValidationError, setInputValidationError] = useState<string>('');

  const validateInput = (input: string) => {
    if (input?.length == 0 || input?.trim() == '') {
      setInputValidationError('input tidak boleh kosong');
      return false;
    }

    setInputValidationError('');
    return true;
  };

  const handleInputLocalChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(event?.target?.value);
      //   if (validateInput(event?.target?.value)) {
      //     setInput(event?.target?.value);
      //   }
    },
    200,
  );

  return {
    input,
    setInput,
    validateInput,
    inputValidationError,
    setInputValidationError,
    handleInputLocalChange,
  };
};
