import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  position: absolute;

  @media (max-width: 1440px) {
    width: max-content;
    justify-content: space-between;
    flex-direction: row;
    gap: 5px;
    padding: 10px;
    align-items: flex-end;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 5px;
    padding: 1rem;
    position: relative;
    button {
      font-size: 12px;
      padding: 10px;
    }
  }

  z-index: 10;
`;

export const FilterButtonStyle = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.primary_color};
  width: 150px;
  height: max-content;
  border-radius: 12px;

  button {
    width: 150px;
    height: 50px;
    background-color: transparent;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    padding: 5px;
  }

  @media (max-width: 768px) {
    width: 100%;

    button {
      width: 100%;
      font-size: 12px;
      text-align: center;
    }
  }
`;
