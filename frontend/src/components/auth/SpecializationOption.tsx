import {
  SpecializationCustomSelect,
  SpecializationOptionContainer,
} from '@/styles/SpecializationOption.styles';
import { SelectHTMLAttributes } from 'react';

interface SpecializationOptionItf
  extends SelectHTMLAttributes<HTMLSelectElement> {
  title: string;
  $marBot: number;
  options: Array<string>;
  onOptionChange: Function;
}

const SpecializationOption = ({
  title = 'Default input label',
  $marBot = 0,
  options = [],
  onOptionChange = () => {},
}: SpecializationOptionItf): React.ReactElement => {
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onOptionChange(event.target.value);
  };

  return (
    <SpecializationOptionContainer $marBot={$marBot}>
      {title}
      <SpecializationCustomSelect onChange={handleOptionChange}>
        {options.map((option, index) => {
          return (
            <option key={`specializationOption${index}`} value={option}>
              {option}
            </option>
          );
        })}
      </SpecializationCustomSelect>
    </SpecializationOptionContainer>
  );
};

export default SpecializationOption;
