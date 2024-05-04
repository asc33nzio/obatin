import styled from 'styled-components';

export const StyledToastContainer = styled.div<{ $orientation?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ $orientation }) =>
    $orientation === 'left'
      ? 'flex-start'
      : $orientation === 'right'
        ? 'flex-end'
        : 'center'};

  width: 100vw;
  height: 175px;
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  padding-right: ${({ $orientation }) =>
    $orientation === 'right' ? '50px' : 0};
  padding-left: ${({ $orientation }) => ($orientation === 'left' ? '50px' : 0)};

  animation: dropAnimation 1.5s ease;
  @keyframes dropAnimation {
    0% {
      transform: translateY(-300px);
    }
    100% {
      transform: translateY(0);
    }
  }

  z-index: 100001;
`;

export const StyledToast = styled.div<{ $type: string; $resolution: string }>`
  --bg-color-ok: #05b6c1;
  --color-ok: white;
  --bg-color-warning: #d9ca86;
  --color-warning: white;
  --bg-color-error: #dc185d;
  --color-error: white;

  display: flex;
  flex-direction: center;
  align-items: center;
  justify-content: center;
  width: ${({ $resolution }) => ($resolution === 'desktop' ? '30%' : '60%')};
  height: ${({ $resolution }) => ($resolution === 'desktop' ? '50px' : '60px')};

  background-color: ${({ $type }) =>
    $type === 'ok'
      ? 'var(--bg-color-ok)'
      : $type === 'warning'
        ? 'var(--bg-color-warning)'
        : 'var(--bg-color-error)'};
  border: 1px solid #cbd5e0;
  border-radius: 15px;

  color: ${({ $type }) =>
    $type === 'ok'
      ? 'var(--color-ok)'
      : $type === 'warning'
        ? 'var(--color-warning)'
        : 'var(--color-error)'};
  text-align: center;
  font-size: 24px;
  font-weight: 500;

  z-index: 100002;
`;
