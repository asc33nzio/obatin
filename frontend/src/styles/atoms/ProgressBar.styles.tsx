import styled from 'styled-components';

export const ProgressBarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 35px;
  background-color: #ece7e7;

  border-radius: 10px;
  margin-bottom: 10px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;

  :first-child {
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
  }

  :last-child {
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
  }
`;

export const ProgressBarNode = styled.div<{
  $isActive: boolean;
  $isNextNodeActive: boolean;
  $isPrevNodeActive: boolean;
  $isComplete: boolean;
}>`
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  background: ${({
    $isActive,
    $isNextNodeActive,
    $isPrevNodeActive,
    $isComplete,
  }) => {
    if ($isComplete || ($isActive && $isNextNodeActive)) {
      return '#00b5c0';
    } else if ($isActive && !$isNextNodeActive) {
      return 'linear-gradient(90deg, rgba(0,181,192,1) 74%, rgba(255,255,255,1) 100%)';
    } else if ($isPrevNodeActive && !$isNextNodeActive) {
      return 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(204,204,204,1) 5%)';
    } else if (!$isPrevNodeActive && !$isNextNodeActive) {
      return '#cccccc';
    }
  }};
`;

export const NodeCircleBg = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${({ $isActive }) => ($isActive ? '#98e7b7' : '#ff423d')};
`;

export const NodeCircle = styled.div<{ $isActive: boolean }>`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${({ $isActive }) => ($isActive ? '#409261' : '#a8003a')};
`;
