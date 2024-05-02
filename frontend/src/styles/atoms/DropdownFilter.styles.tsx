import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  position: absolute;

  @media (max-width: 1440px) {
    width: 50vh;
    justify-content: space-between;
  }
`;

export const FilterButtonStyle = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${COLORS.primary_color};
  width: 150px;
  height: max-content;
  border-radius: 12px;

  button {
    padding: 15px;
    background-color: transparent;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
  }
`;
