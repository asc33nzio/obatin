import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const SidebarContainer = styled.aside<{ $isOpened: boolean }>`
  border-right: 1px solid ${COLORS.input_border};
  width: ${(props) => (props.$isOpened ? '15vw' : '0vw')};
  min-height: 100vh;
  transition: width 0.5s;
  overflow: hidden;
  color: ${COLORS.primary_text};
  padding: 40px 0px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: fixed;
  background-color: white;

  svg {
    width: 40px;
  }

  a {
    text-decoration: none;
  }
  z-index: 10;
  @media (max-width: 1440px) {
    width: ${(props) => (props.$isOpened ? '30vw' : '0vw')};
  }
`;

export const TOP = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  justify-content: center;

  svg {
    width: 100px;
  }
`;
