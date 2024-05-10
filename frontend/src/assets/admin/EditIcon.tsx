import React from 'react';

interface IPropsDeleteIcon {
  onClick: () => void;
}

const EditIcon: React.FC<IPropsDeleteIcon> = ({ onClick }) => {
  return (
    <svg
      width='25'
      height='24'
      viewBox='0 0 25 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <path
        d='M11.0894 4H4.08936C3.55892 4 3.05021 4.21071 2.67514 4.58579C2.30007 4.96086 2.08936 5.46957 2.08936 6V20C2.08936 20.5304 2.30007 21.0391 2.67514 21.4142C3.05021 21.7893 3.55892 22 4.08936 22H18.0894C18.6198 22 19.1285 21.7893 19.5036 21.4142C19.8786 21.0391 20.0894 20.5304 20.0894 20V13'
        stroke='#00B5C0'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M18.5894 2.50023C18.9872 2.1024 19.5267 1.87891 20.0894 1.87891C20.652 1.87891 21.1915 2.1024 21.5894 2.50023C21.9872 2.89805 22.2107 3.43762 22.2107 4.00023C22.2107 4.56284 21.9872 5.1024 21.5894 5.50023L12.0894 15.0002L8.08936 16.0002L9.08936 12.0002L18.5894 2.50023Z'
        stroke='#00B5C0'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
};

export default EditIcon;
