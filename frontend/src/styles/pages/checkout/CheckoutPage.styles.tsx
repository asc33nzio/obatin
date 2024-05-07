import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const Body = styled.div`
  padding: 2rem;
  /* background-color: #fdfafa; */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const COcard = styled.div`
  background-color: white;
  width: 60vw;
  min-height: 80vh;
  border-radius: 12px;
  padding: 2rem;
  box-shadow:
    0 10px 20px rgba(197, 197, 197, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
`;

export const Section = styled.div<{ $isBorder: boolean }>`
  height: max-content;
  border-bottom: ${(props) =>
    props.$isBorder ? `1px dashed ${COLORS.primary_text}` : 'none'};
  h2 {
    font-size: 16px;
    color: ${COLORS.primary_text};
  }
`;

export const SubmitSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  bottom: 0;
  padding-top: 2rem;
`;
