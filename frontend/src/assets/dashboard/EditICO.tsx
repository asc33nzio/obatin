interface EditICOItf {
  onClick: () => void;
}

const EditICO: React.FC<EditICOItf> = (props: { onClick: Function }) => {
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
        fill='#CBD5E0'
        stroke='#4A5568'
      />
      <mask
        id='mask0_221_2750'
        style={{ maskType: 'alpha' }}
        maskUnits='userSpaceOnUse'
        x='3'
        y='3'
        width='33'
        height='33'
      >
        <rect x='3' y='3' width='33' height='33' fill='#D9D9D9' />
      </mask>
      <g mask='url(#mask0_221_2750)'>
        <path
          d='M9.875 29.125H11.8344L25.275 15.6844L23.3156 13.725L9.875 27.1656V29.125ZM7.125 31.875V26.0312L25.275 7.91562C25.55 7.66354 25.8536 7.46875 26.1859 7.33125C26.5182 7.19375 26.8677 7.125 27.2344 7.125C27.601 7.125 27.9563 7.19375 28.3 7.33125C28.6438 7.46875 28.9417 7.675 29.1938 7.95L31.0844 9.875C31.3594 10.1271 31.5599 10.425 31.6859 10.7688C31.812 11.1125 31.875 11.4563 31.875 11.8C31.875 12.1667 31.812 12.5161 31.6859 12.8484C31.5599 13.1807 31.3594 13.4844 31.0844 13.7594L12.9688 31.875H7.125ZM24.2781 14.7219L23.3156 13.725L25.275 15.6844L24.2781 14.7219Z'
          fill='#4A5568'
        />
      </g>
    </svg>
  );
};

export default EditICO;
