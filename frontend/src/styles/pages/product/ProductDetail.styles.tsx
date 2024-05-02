import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const ProductDetailContainer = styled.div`
  width: 100%;
  padding: 5rem;
  min-height: 100vh;
  display: flex;
  gap: 3rem;
  img {
    border: 1px solid ${COLORS.primary_color};
    border-radius: 12px;
    width: 700px;
    height: 700px;
  }
  @media (max-width: 1440px) {
    flex-direction: column;
  }
  @media (max-width: 768px) {
    padding: 1.5rem;
    align-items: center;
    img {
      width: 300px;
      height: 300px;
    }
  }
`;

export const ProductDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  h1 {
    font-size: 21px;
    font-weight: 500;
  }
  h3 {
    font-weight: 300;
    font-size: 16;
  }
  div {
    padding-bottom: 20px;
    border-bottom: 1px solid ${COLORS.primary_text};
    h2 {
      font-size: 18px;
    }
    p {
      padding: 10px 0;
    }
  }
`;

export const ButtonAdd = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

export const Price = styled.p`
  font-size: 24px;
  font-weight: 700;
`;
