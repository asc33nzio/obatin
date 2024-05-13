import React from 'react';

interface IIconSeeDetail {
  onHover?: boolean;
  onClick?: () => void;
}

function SeeDetail(props: IIconSeeDetail) {
  const test = () => {
    props.onClick && props.onClick();
    console.log('franky');
  };
  return (
    <svg
      width='25'
      height='25'
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      style={{ cursor: 'pointer' }}
      onClick={() => test()}
    >
      <mask
        id='mask0_212_9729'
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='40'
        height='40'
      >
        <rect width='40' height='40' fill='#D9D9D9' />
      </mask>
      <g mask='url(#mask0_212_9729)'>
        <path
          d='M13.3333 30.0002H26.6666V26.6668H13.3333V30.0002ZM13.3333 23.3335H26.6666V20.0002H13.3333V23.3335ZM9.99996 36.6668C9.08329 36.6668 8.29857 36.3404 7.64579 35.6877C6.99301 35.0349 6.66663 34.2502 6.66663 33.3335V6.66683C6.66663 5.75016 6.99301 4.96544 7.64579 4.31266C8.29857 3.65989 9.08329 3.3335 9.99996 3.3335H23.3333L33.3333 13.3335V33.3335C33.3333 34.2502 33.0069 35.0349 32.3541 35.6877C31.7013 36.3404 30.9166 36.6668 30 36.6668H9.99996ZM21.6666 15.0002V6.66683H9.99996V33.3335H30V15.0002H21.6666Z'
          fill={props.onHover ? '#00a7b0' : '#00B5C0'}
        />
      </g>
    </svg>
  );
}

export default SeeDetail;
