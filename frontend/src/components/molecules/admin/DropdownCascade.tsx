import React, { useState } from 'react';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export interface IDropdownProps {
  options: Option[];
  onChange: (value: string) => void;
  defaultValue?: string;
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

const CascadeDropdown = ({
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
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCategoryClick = (categorySlug: string) => {
    setOpenCategories({
      ...openCategories,
      [categorySlug]: !openCategories[categorySlug],
    });
  };

  const renderOptions = (options: Option[]) => {
    return options.map((option) => (
      <React.Fragment key={option.value}>
        <button
          style={{
            padding: '10px 5px',
            cursor: 'pointer',
            backgroundColor: '#f4f4f4',
            border: 'none',
            color: 'black',
            textAlign: 'left',
          }}
          onClick={() => {
            if (option.children) {
              handleCategoryClick(option.value);
            } else {
              handleChange(option.value);
            }
          }}
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
          {option.children && (
            <span>{openCategories[option.value] ? ' \u25BC' : ' \u25B6'}</span>
          )}
        </button>
        {option.children &&
          openCategories[option.value] &&
          renderOptions(option.children)}
      </React.Fragment>
    ));
  };

  const handleChange = (value: string) => {
    onChange(value);
    setSelectedOption(value);
    setIsOpen(false);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    defaultValue ?? '',
  );

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
        {selectedOption || placeholder || 'pilih kategori'}
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
            {renderOptions(options)}
          </div>
        </div>
      )}
    </div>
  );
};

export default CascadeDropdown;
