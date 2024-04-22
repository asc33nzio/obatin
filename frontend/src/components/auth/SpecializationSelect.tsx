import MagnifyICO from '@/assets/icons/MagnifyICO';
import {
  SpecializationCustomSelect,
  SpecializationSelectContainer,
  TitleAndSearchDiv,
} from '@/styles/SpecializationOption.styles';
import { SelectHTMLAttributes, useState } from 'react';

interface SpecializationSelectItf
  extends SelectHTMLAttributes<HTMLSelectElement> {
  title: string;
  $marBot: number;
  options: Array<string>;
  onOptionChange: Function;
}

const SpecializationSelect = ({
  title = 'Default input label',
  $marBot = 0,
  options = [],
  onOptionChange = () => {},
}: SpecializationSelectItf): React.ReactElement => {
  const [query, setQuery] = useState<string>('');
  const [isSearchItfOpen, setIsSearchItfOpen] = useState<boolean>(false);
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onOptionChange(event.target.value);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <SpecializationSelectContainer $marBot={$marBot}>
      <TitleAndSearchDiv>
        {title}
        <MagnifyICO onClick={() => setIsSearchItfOpen(!isSearchItfOpen)} />
        {isSearchItfOpen && (
          <input
            type='text'
            placeholder='Cari spesialisasi anda'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
      </TitleAndSearchDiv>
      
      <SpecializationCustomSelect onChange={handleOptionChange}>
        {filteredOptions.map((option, index) => {
          return (
            <option key={`specializationOption${index}`} value={option}>
              {option}
            </option>
          );
        })}
      </SpecializationCustomSelect>
    </SpecializationSelectContainer>
  );
};

export default SpecializationSelect;
