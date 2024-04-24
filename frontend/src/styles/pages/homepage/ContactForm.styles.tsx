import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const Container = styled.form`
  width: 800px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: ${COLORS.primary_text};
`;

export const Description = styled.p`
  font-size: 28;
  text-align: center;
`;

export const InputSec = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  input {
    outline: none;
    border: 0px;
    height: 50px;
  }
  textarea {
    outline: none;
    border: 0px;
  }
  border-bottom: 1px solid ${COLORS.primary_color};
`;
