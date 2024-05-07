import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const DetailPharmacyContainer = styled.div`
  background-color: white;
  width: 100%;
  min-height: 500px;
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: ${COLORS.primary_text};
`;
