interface CloseICOProps {
  onClick: () => void;
}

const CloseICO: React.FC<CloseICOProps> = (props: { onClick: Function }) => {
  return (
    <svg
      height='800px'
      width='800px'
      version='1.1'
      id='Layer_1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 512 512'
      xmlSpace='preserve'
      onClick={() => props.onClick()}
    >
      <path
        style={{ fill: '#B3404A' }}
        d='M83.753,511.961c-21.451,0-42.904-8.167-59.236-24.497c-32.663-32.664-32.663-85.811,0-118.473
	l201.65-201.65c6.38-6.377,16.719-6.377,23.101,0c6.378,6.378,6.378,16.721,0,23.101l-201.65,201.65
	c-19.926,19.926-19.926,52.348,0,72.273c19.926,19.927,52.346,19.924,72.272,0l344.455-344.455
	c19.926-19.926,19.926-52.348,0-72.273c-19.927-19.929-52.348-19.926-72.272,0l-51.881,51.881c-6.38,6.377-16.719,6.377-23.101,0
	c-6.378-6.378-6.378-16.721,0-23.101l51.881-51.881c32.664-32.659,85.808-32.661,118.472,0c32.663,32.663,32.663,85.809,0,118.473
	L142.988,487.464C126.656,503.794,105.205,511.961,83.753,511.961z'
      />
      <path
        style={{ fill: '#F4B2B0' }}
        d='M475.894,475.914L475.894,475.914c-26.336,26.336-69.036,26.336-95.373,0L36.066,131.459
	c-26.336-26.336-26.336-69.036,0-95.373l0,0c26.336-26.336,69.036-26.336,95.373,0l344.455,344.455
	C502.231,406.878,502.231,449.577,475.894,475.914z'
      />
      <path
        style={{ fill: '#B3404A' }}
        d='M428.208,512c-22.377,0-43.413-8.714-59.237-24.535L24.517,143.01
	c-32.663-32.664-32.663-85.809,0-118.473C40.341,8.714,61.377,0,83.753,0c22.377,0,43.413,8.714,59.238,24.535L487.445,368.99
	c15.822,15.824,24.535,36.86,24.535,59.238c0,22.377-8.714,43.413-24.535,59.238C471.621,503.286,450.585,512,428.208,512z
	 M83.753,32.667c-13.648,0-26.483,5.315-36.135,14.968c-19.926,19.926-19.926,52.348,0,72.273l344.455,344.455
	c9.652,9.653,22.487,14.968,36.137,14.968c13.648,0,26.483-5.315,36.135-14.968c9.653-9.652,14.968-22.487,14.968-36.137
	c0-13.65-5.315-26.485-14.968-36.137L119.889,47.636C110.238,37.982,97.403,32.667,83.753,32.667z'
      />
    </svg>
  );
};

export default CloseICO;