import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const UploadModalContainer = styled.div`
  background-color: white;
  width: 50vw;
  height: max-content;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 20px;
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 400px;
  border: 2px dashed ${COLORS.primary_color};
  border-radius: 12px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
