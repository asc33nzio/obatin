interface DeleteICOItf {
  onClick: () => void;
}

const DeleteICO: React.FC<DeleteICOItf> = (props: { onClick: Function }) => {
  return (
    <svg
      width='38'
      height='38'
      viewBox='0 0 38 38'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={() => props.onClick()}
    >
      <rect
        x='0.5'
        y='0.5'
        width='37'
        height='37'
        rx='7.5'
        fill='#FFD4C8'
        stroke='#BF2A00'
      />
      <mask
        id='mask0_221_2755'
        style={{ maskType: 'alpha' }}
        maskUnits='userSpaceOnUse'
        x='3'
        y='3'
        width='33'
        height='33'
      >
        <rect x='3' y='3' width='33' height='33' fill='#D9D9D9' />
      </mask>
      <g mask='url(#mask0_221_2755)'>
        <path
          d='M12.125 31.75C11.3688 31.75 10.7214 31.4807 10.1828 30.9422C9.64427 30.4036 9.375 29.7563 9.375 29V11.125H8V8.375H14.875V7H23.125V8.375H30V11.125H28.625V29C28.625 29.7563 28.3557 30.4036 27.8172 30.9422C27.2786 31.4807 26.6313 31.75 25.875 31.75H12.125ZM25.875 11.125H12.125V29H25.875V11.125ZM14.875 26.25H17.625V13.875H14.875V26.25ZM20.375 26.25H23.125V13.875H20.375V26.25Z'
          fill='#BF2A00'
        />
      </g>
    </svg>
  );
};

export default DeleteICO;
