import styled from 'styled-components';

export const StyledToastContainer = styled.div<{ orientation?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) =>
    props.orientation === 'left'
      ? 'flex-start'
      : props.orientation === 'right'
      ? 'flex-end'
      : 'center'};
  padding-right: ${(props) => (props.orientation === 'right' ? '50px' : 0)};
  padding-left: ${(props) => (props.orientation === 'left' ? '50px' : 0)};

  background: transparent;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  width: 100vw;
  height: ${(props) => (props.orientation === 'right' ? '300px' : '100px')};

  animation: dropAnimation 1.5s ease;
  @keyframes dropAnimation {
    0% {
      transform: translateY(-300px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

export const StyledToast = styled.div<{ type: string; $resolution: string }>`
  --bg-color-ok: green;
  --color-ok: black;
  --bg-color-warning: yellow;
  --color-warning: black;
  --bg-color-error: red;
  --color-error: black;

  width: ${({ $resolution }) => ($resolution === 'desktop' ? '30%' : '60%')};
  height: ${({ $resolution }) => ($resolution === 'desktop' ? '50px' : '60px')};

  display: flex;
  flex-direction: center;
  align-items: center;
  justify-content: center;
  z-index: 3;

  background-color: ${(props) =>
    props.type === 'ok' ? 'var(--bg-color-ok)' : 'var(--bg-color-error)'};
  color: ${(props) =>
    props.type === 'ok' ? 'var(--color-ok)' : 'var(--color-error)'};
  border: ${(props) =>
    props.type === 'ok'
      ? '2px solid var(--color-ok)'
      : '2px solid var(--color-error)'};
  border-radius: 15px;

  text-align: center;
  font-size: 24px;
  font-weight: 500;
`;
