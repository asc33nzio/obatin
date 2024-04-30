import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  align-self: center;
  justify-self: center;

  height: 125px;
  width: 100vw;

  padding-left: 50px;
  padding-right: 75px;
  margin-bottom: 25px;

  border-bottom: 0.5px solid ${COLORS.input_border};
  @media (max-width: 769px) {
    width: 100%;
    padding: 0 0 20px 0;
    flex-direction: column;
    height: max-content;
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 250px;
  height: 75px;
  gap: 25px;

  svg {
    cursor: pointer;
    object-fit: cover;

    width: 50%;
    height: 100%;
  }
  @media (max-width: 769px) {
    padding: 0;
  }
`;

export const IconContainer = styled.div`
  background: transparent;

  svg {
    cursor: pointer;
    height: 50px;
  }
`;

export const Right = styled.div`
  @media (max-width: 769px) {
    display: none;
  }
`;
