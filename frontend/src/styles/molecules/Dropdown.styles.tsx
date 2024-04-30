import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const CategoryDropdown = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const Dropdown = styled.li`
  margin: 2px;
  width: max-content;
  padding: 10px;

  a {
    cursor: pointer;
    text-decoration: none;
    color: #333;
    font-weight: bold;
    &:hover {
      background-color: ${COLORS.primary_color};
      color: white;
    }
  }
  ul {
    list-style-type: none;
    /* padding-left: 12px; */
  }
`;
