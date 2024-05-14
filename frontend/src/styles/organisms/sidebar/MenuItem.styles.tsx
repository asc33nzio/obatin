import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const MenuItemContainer = styled.div<{ $depth: number }>`
  display: flex;
  flex-direction: row;
  font-size: 20px;
  padding: 10px 0px 10px 10px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  & svg {
    height: 30px;
    margin-right: 10px;
    color: ${COLORS.primary_text};
  }

  &:hover {
    background-color: ${COLORS.input_border};
  }
`;

export const MenuItems = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${COLORS.primary_text};
  text-decoration: none;

  &.selected {
    color: ${COLORS.primary_color};
  }

  span {
    color: ${COLORS.primary_text};
    text-decoration: none;
  }
`;
