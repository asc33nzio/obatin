import React, { useEffect, useState } from 'react';
import CategoryComponent from '../category/Category';
interface DropdownAdminProps {
  data: any[];
  onChangeFromDropdown: (category: number) => void;
}

const DropdownAdmin: React.FC<DropdownAdminProps> = ({
  data,
  onChangeFromDropdown,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useEffect(() => {
    categoryId && onChangeFromDropdown(categoryId);
    setCategoryId(null);
  }, [categoryId, onChangeFromDropdown]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <input
        type='text'
        placeholder='Pilih Kategori'
        style={{ padding: '10px', border: '1px solid #ccc', cursor: 'pointer' }}
        readOnly
        onClick={toggleDropdown}
      />
      {isOpen && (
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#00B5C0',
            boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
            position: 'absolute',
            top: 'calc(100% + 5px)',
            left: 0,
            width: '100%',
            padding: '10px',
          }}
        >
          <CategoryComponent
            categories={data}
            setCategoryId={setCategoryId}
            setParentPage={() => console.log('hahaha')}
          />
        </div>
      )}
    </div>
  );
};

export default DropdownAdmin;
