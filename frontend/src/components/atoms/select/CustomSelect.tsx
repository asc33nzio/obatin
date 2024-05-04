import {
  CustomOption,
  CustomSelectContainer,
  CustomSelectStyle,
} from '@/styles/atoms/CustomSelect.styles';
import { useState } from 'react';

interface CustomSelectItf {
  $title: string;
  $options: Array<any>;
  $onOptionChange: Function;
  $disabled: boolean;
  $defaultSelected?: string | null;
}

const CustomSelect = ({
  $title = 'Default input label',
  $options = [],
  $onOptionChange = () => {},
  $disabled = false,
  $defaultSelected = '',
}: CustomSelectItf): React.ReactElement => {
  const [isCustomSelectOpen, setIsCustomSelectOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    $onOptionChange(option);
    setIsCustomSelectOpen(false);
  };

  const handleReset = () => {
    setSelectedOption(null);
    $onOptionChange('__RESET__');
    setIsCustomSelectOpen(false);
  };

  return (
    <CustomSelectContainer
      onClick={() =>
        !$disabled ? setIsCustomSelectOpen(!isCustomSelectOpen) : null
      }
      $disabled={$disabled}
    >
      {$defaultSelected
        ? $defaultSelected
        : selectedOption
          ? selectedOption
          : $title}
      {/* {selectedOption || $defaultSelected || $title} */}

      <CustomSelectStyle $isOpen={isCustomSelectOpen}>
        <CustomOption key='resetOption' onClick={() => handleReset()}>
          Tidak ada pilihan sesuai
        </CustomOption>
        {$options.map((option, index) => (
          <CustomOption key={index} onClick={() => handleOptionChange(option)}>
            {option}
          </CustomOption>
        ))}
      </CustomSelectStyle>
    </CustomSelectContainer>
  );
};

export default CustomSelect;
