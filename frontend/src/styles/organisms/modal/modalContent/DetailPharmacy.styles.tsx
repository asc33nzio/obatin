import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const DetailPharmacyContainer = styled.div`
  background-color: white;
  width: 100%;
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  gap: 20px;

  color: ${COLORS.primary_text};
  h2 {
    text-align: center;
    color: ${COLORS.primary_color};
  }
  @media (max-width: 768px) {
    width: 300px;
  }
`;

export const DetailSec = styled.div`
  background-color: ${COLORS.primary_color};
  opacity: 70%;
  color: white;

  padding: 10px;
  border-radius: 12px;
  box-shadow:
    rgb(204, 219, 232) 3px 3px 6px 0px inset,
    rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;

  font-weight: 600;
`;

export const DetailSecRow = styled.div`
  font-weight: 600;
  display: flex;
  gap: 20px;

  border: 1px solid ${COLORS.primary_color};
  border-radius: 12px;
  padding: 12px;

  svg {
    width: 100px;
  }
`;
