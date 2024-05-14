import styled, { keyframes } from 'styled-components';

const progressBarAnimation = keyframes`
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
`;

export const ToastProgressBar = styled.div<{
  $duration: number;
  $type: string;
}>`
  --border-color-ok: #00b5c0;
  --bg-color-ok: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 65%,
    rgba(0, 181, 192, 1) 100%
  );
  --border-color-warning: #d9ca86;
  --bg-color-warning: linear-gradient(
    90deg,
    rgba(255, 255, 255, 1) 65%,
    rgba(217, 202, 134, 1) 100%
  );
  --border-color-error: #dc185d;
  --bg-color-error: linear-gradient(
    90deg,
    rgba(249, 200, 216, 1) 75%,
    rgba(165, 18, 70, 1) 100%
  );

  position: absolute;
  display: block;
  width: 100%;
  height: 5px;

  bottom: 0;
  left: 0;
  border-left: 1px solid;
  border-right: 1px solid;
  border-bottom: 1px solid;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  animation: ${progressBarAnimation} ${({ $duration }) => $duration}ms linear
    reverse;

  background: rgb(255, 255, 255);
  border-color: ${({ $type }) =>
    $type === 'ok'
      ? 'var(--border-color-ok)'
      : $type === 'warning'
        ? 'var(--border-color-warning)'
        : 'var(--border-color-error)'};

  background: ${({ $type }) =>
    $type === 'ok'
      ? 'var(--bg-color-ok)'
      : $type === 'warning'
        ? 'var(--bg-color-warning)'
        : 'var(--bg-color-error)'};
`;

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
  width: ${({ $resolution }) => ($resolution === 'desktop' ? '27.5%' : '60%')};
  height: ${({ $resolution }) => ($resolution === 'desktop' ? '75px' : '60px')};
  padding: 10px 15px;

  background-color: ${({ $type }) =>
    $type === 'ok'
      ? 'var(--bg-color-ok)'
      : $type === 'warning'
        ? 'var(--bg-color-warning)'
        : 'var(--bg-color-error)'};
  border: 1px solid #cbd5e0;
  border-radius: 6px;

  color: ${({ $type }) =>
    $type === 'ok'
      ? 'var(--color-ok)'
      : $type === 'warning'
        ? 'var(--color-warning)'
        : 'var(--color-error)'};
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  overflow: hidden;
  word-wrap: break-word;
  text-overflow: ellipsis;

  position: relative;
  z-index: 100002;
`;
