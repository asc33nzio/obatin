interface DetailICOPropsItf {
  onClick: () => void;
}

const DetailICO = (props: DetailICOPropsItf): React.ReactElement => {
  return (
    <svg
      fill='#fff0f0'
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      onClick={() => props.onClick()}
    >
      <g fill='gray'>
        <path d='M8 16a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8zm0-1a7 7 0 0 0 7-7 7 7 0 0 0-7-7 7 7 0 0 0-7 7 7 7 0 0 0 7 7z' />

        <path
          d='M8 3.75c-.386 0-.69.124-.914.373A1.269 1.269 0 0 0 6.75 5c0 .336.112.628.336.877.224.249.528.373.914.373s.69-.124.914-.373c.224-.249.336-.541.336-.877 0-.336-.112-.628-.336-.877C8.69 3.874 8.386 3.75 8 3.75zM7 7v5h2V7z'
          fontFamily='Ubuntu'
          fontWeight='400'
          letterSpacing='0'
          wordSpacing='0'
        />
      </g>
    </svg>
  );
};

export default DetailICO;
