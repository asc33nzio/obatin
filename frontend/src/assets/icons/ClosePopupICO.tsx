interface CloseICOProps {
  onClick: () => void;
}

const ClosePopupICO: React.FC<CloseICOProps> = (props: {
  onClick: Function;
}) => {
  return (
    <svg
      width='800px'
      height='800px'
      viewBox='0 0 24 24'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      onClick={() => props.onClick()}
    >
      <g
        id='Page-1'
        stroke='none'
        strokeWidth='1'
        fill='none'
        fillRule='evenodd'
      >
        <g id='Close-Circle'>
          <rect
            id='Rectangle'
            fillRule='nonzero'
            x='0'
            y='0'
            width='24'
            height='24'
          ></rect>
          <circle
            id='Oval'
            stroke='#FFFFFF'
            strokeWidth='2'
            strokeLinecap='round'
            cx='12'
            cy='12'
            r='9'
          ></circle>
          <line
            x1='14.1213'
            y1='9.87866'
            x2='9.8787'
            y2='14.1213'
            id='Path'
            stroke='#FFFFFF'
            strokeWidth='2'
            strokeLinecap='round'
          ></line>
          <line
            x1='9.87866'
            y1='9.87866'
            x2='14.1213'
            y2='14.1213'
            id='Path'
            stroke='#FFFFFF'
            strokeWidth='2'
            strokeLinecap='round'
          ></line>
        </g>
      </g>
    </svg>
  );
};

export default ClosePopupICO;
