import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const SearchContainer = styled.div`
  width: 600px;
  height: 50px;
  border: 0.5px solid ${COLORS.input_border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const SearchInput = styled.input`
  border: 0px solid;
  width: 100%;
  outline: none;
`;
