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

export const ImageContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 400px;
  border: 2px dashed ${COLORS.primary_color};
  border-radius: 12px;
  padding: 1px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const PdfContainer = styled.section`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  canvas {
    align-self: center;
    justify-self: center;
    display: block;
    width: 100%;
    height: 100%;
    background-color: transparent;
    object-fit: cover;
  }

  div {
    align-self: center;
    justify-self: center;
    display: block;
    width: 100%;
    height: 100%;
    background-color: transparent;
    object-fit: cover;
  }
`;

export const CheckoutImageContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 450px;
  border: 2px dashed ${COLORS.primary_color};
  border-radius: 12px;
  padding: 1px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
