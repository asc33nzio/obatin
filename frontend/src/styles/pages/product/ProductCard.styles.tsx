import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const Imagecontainer = styled.img`
  width: 150px;
`;

export const ProductCard = styled.a`
  width: 270px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${COLORS.input_border};
  border-radius: 12px;
  padding: 20px;
  justify-content: space-between;
  color: ${COLORS.primary_text};
  text-align: center;
  text-decoration: none;
  gap: 5px;

  &:hover {
    zoom: 101%;
    border: 1px solid ${COLORS.primary_color};
  }
  @media (max-width: 1440px) {
    gap: 5px;
    width: 250px;
  }
`;

export const Bold = styled.p`
  font-weight: 700;
  font-size: 19px;
`;

export const Smallfont = styled.p`
  color: #a5a5a5;
  font-size: 14px;
  text-align: center;
`;

export const Price = styled.p`
  font-weight: 500;
  font-size: 14px;
  text-align: center;
`;
export const ArrowRight = styled.div`
  color: ${COLORS.primary_color};
`;
