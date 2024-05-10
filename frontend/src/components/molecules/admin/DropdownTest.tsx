import React, { useState } from 'react';
interface Option {
  value: string;
  label: string;
}

export interface IDropdownProps {
  options: Option[];
  onChange: (value: string) => void;
  defaultValue?: string;
  value?: string;
  fontSize?: string;
  background?: string;
  backgroundOption?: string;
  fontWeight?: string;
  padding?: string;
  fontColor?: string;
  backgroundOnHover?: string;
  style?: React.CSSProperties;
  borderRadius?: string;
  name?: string;
  placeholder?: string;
}

const DropdownTest = ({
  options,
  onChange,
  fontSize,
  background,
  backgroundOption,
  backgroundOnHover,
  fontWeight,
  fontColor,
  defaultValue,
  padding,
  borderRadius,
  placeholder,
}: IDropdownProps): React.ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    defaultValue ?? '',
  );

  const handleChange = (value: string) => {
    onChange(value);
    setSelectedOption(value);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: background,
          color: fontColor,
          fontSize: fontSize,
          fontWeight: fontWeight,
          padding: padding,
          borderRadius: borderRadius,
          border: 'none',
          width: '100%',
          cursor: 'pointer',
        }}
      >
        {selectedOption || placeholder || 'select something'}
      </button>
      {isOpen && (
        <div
          style={{
            backgroundColor: backgroundOption,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              margin: '1% auto',
              flexDirection: 'column',
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                style={{
                  padding: '10px 5px',
                  cursor: 'pointer',
                  backgroundColor: '#f4f4f4',
                  border: 'none',
                  color: 'black',
                  textAlign: 'left',
                }}
                onClick={() => handleChange(option.value)}
                onMouseEnter={(e) => {
                  if (backgroundOnHover) {
                    e.currentTarget.style.backgroundColor = backgroundOnHover;
                  }
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f4f4f4')
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownTest;
