import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const DropdownContainer = styled.div`
  display: inline-block;
  position: relative;
  color: ${COLORS.primary_color};
  border: 1px solid ${COLORS.primary_color};
  padding: 10px;
  border-radius: 12px;
  &:hover + & {
    display: inline-block;
  }
`;

export const DropdownMenu = styled.div`
  background-color: #f9f9f9;
  display: none;
  padding: 12px 16px;
  position: absolute;
  right: 0;
  z-index: 1;
  color: ${COLORS.primary_color};
`;

export const DropdownButton = styled.button`
  background-color: transparent;
  border: 1px solid ${COLORS.primary_color};
  padding: 10px;
  border-radius: 12px;
  color: ${COLORS.primary_color};

  &:hover + & {
    display: inline-block;
  }
`;
