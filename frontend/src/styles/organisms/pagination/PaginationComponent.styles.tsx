import styled from 'styled-components';

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  height: 75px;
  @media (max-width: 1440px) {
    gap: 0;
  }
`;

export const PagingButton = styled.button<{
  $disabled?: boolean;
  $bgColor?: string;
  $isCurrentPage?: boolean;
}>`
  cursor: ${({ $isCurrentPage }) => ($isCurrentPage ? 'default' : 'pointer')};
  background-color: ${({ $disabled, $bgColor }) =>
    $disabled && !$bgColor ? '#518A90' : $bgColor ? $bgColor : '#B5FFE1'};
  color: ${({ $isCurrentPage }) => ($isCurrentPage ? '#ffffff' : '#00b5c0')};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 2px 3px 5px gray;
  border: ${({ $disabled }) =>
    $disabled ? '2px outset #3B6468' : '2px inset #3B6468'};
  outline: none;

  &:hover {
    color: ${({ $disabled }) => (!$disabled ? '#C2FFE7' : '#ffffff')};
    background-color: ${({ $disabled }) =>
      !$disabled ? '#00C2CC' : '#00b5c0'};
  }

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 11px;
  }
`;

export const PagingInfo = styled.button<{
  $disabled?: boolean;
  $bgColor?: string;
  $isCurrentPage?: boolean;
}>`
  background-color: #00b5c0;
  color: #ffffff;
  width: 100px;
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  border: 2px outset #3b6468;
`;
