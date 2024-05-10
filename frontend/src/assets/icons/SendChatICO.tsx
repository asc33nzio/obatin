interface SendChatICO {
  onClick: () => void;
}

const SendChatICO: React.FC<SendChatICO> = ({ onClick }) => {
  return (
    <svg
      width='19'
      height='16'
      viewBox='0 0 19 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <path d='M0 16V10L8 8L0 6V0L19 8L0 16Z' fill='white' />
    </svg>
  );
};

export default SendChatICO;
