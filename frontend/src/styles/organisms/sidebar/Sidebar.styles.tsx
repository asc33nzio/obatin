import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const SidebarContainer = styled.aside<{ $isOpened: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;

  width: ${(props) => (props.$isOpened ? '15vw' : '0vw')};
  min-height: 100vh;

  border-right: ${(props) =>
    props.$isOpened ? `1px solid ${COLORS.input_border}` : 'none'};
  transition: width 0.5s;
  overflow: hidden;
  color: ${COLORS.primary_text};
  padding: 40px 0;
  padding: 40px 0;
  gap: 20px;
  background-color: white;

  svg {
    width: 40px;
  }

  a {
    text-decoration: none;
  }

  z-index: 20000;

  @media (max-width: 1440px) {
    width: ${(props) => (props.$isOpened ? '30vw' : '0vw')};
    min-height: 100%;
  }
  @media (max-width: 768px) {
    width: ${(props) => (props.$isOpened ? '40vh' : '0vw')};
    min-height: 100%;
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
