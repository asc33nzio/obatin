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
  padding: 40px 0px;
  gap: 20px;
  background-color: white;

  svg {
    width: 40px;
  }

  a {
    text-decoration: none;
  }

  z-index: 10;
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
