import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  position: absolute;

  @media (max-width: 1440px) {
    width: max-content;
    justify-content: space-between;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
    align-items: flex-end;
  }

  @media (max-width: 768px) {
    width: max-content;
    justify-content: space-between;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
  }

  z-index: 10;
`;

export const FilterButtonStyle = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.primary_color};
  width: 200px;
  height: max-content;
  border-radius: 12px;

  button {
    width: 200px;
    height: 55px;
    background-color: transparent;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    padding: 15px;
  }
`;
