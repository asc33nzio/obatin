import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const NavContainer = styled.div`
  height: Hug(114px);
  padding: 1.5rem 5rem;
  justify-content: space-between;
  display: flex;
  align-items: center;
  border-bottom: 0.5px solid ${COLORS.input_border};
`;

export const Left = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 100px;
  }
`;

export const IconContainer = styled.div`
  padding: 10px;
  cursor: pointer;

  svg {
    height: 30px;
  }
`;
