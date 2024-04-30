import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const MenuItemContainer = styled.div<{ $depth: number }>`
  display: flex;
  flex-direction: row;
  font-size: 20px;
  padding: 10px 0px 10px 10px;
  align-items: center;
  justify-content: space-between;

  & svg {
    height: 30px;
    margin-right: 10px;
  }

  &.selected {
    color: ${COLORS.primary_color};
  }
`;

export const MenuItems = styled.div`
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
