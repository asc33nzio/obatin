import React from 'react';

interface IPropsDeleteIcon {
  onClick: () => void;
}

const DeleteIcon: React.FC<IPropsDeleteIcon> = ({ onClick }) => {
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
        d='M3.08936 6H5.08936H21.0894'
        stroke='#A30D11'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M8.08936 6V4C8.08936 3.46957 8.30007 2.96086 8.67514 2.58579C9.05022 2.21071 9.55892 2 10.0894 2H14.0894C14.6198 2 15.1285 2.21071 15.5036 2.58579C15.8786 2.96086 16.0894 3.46957 16.0894 4V6M19.0894 6V20C19.0894 20.5304 18.8786 21.0391 18.5036 21.4142C18.1285 21.7893 17.6198 22 17.0894 22H7.08936C6.55892 22 6.05021 21.7893 5.67514 21.4142C5.30007 21.0391 5.08936 20.5304 5.08936 20V6H19.0894Z'
        stroke='#A30D11'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M10.0894 11V17'
        stroke='#A30D11'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <path
        d='M14.0894 11V17'
        stroke='#A30D11'
        stroke-width='2'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  );
};

export default DeleteIcon;
