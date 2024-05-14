import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const Imagecontainer = styled.div`
  img {
    object-fit: cover;
  }
`;

export const CategoryCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    scale: 1.03;
    filter: brightness(0.9);
  }
`;

export const CategoryName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

export const ProductCard = styled.a`
  cursor: pointer;
  position: relative;
  width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: 1px solid ${COLORS.input_border};
  border-radius: 12px;
  padding: 15px;
  color: ${COLORS.primary_text};
  text-align: center;
  text-decoration: none;

  &:hover {
    border: 1px solid ${COLORS.primary_color};
  }

  @media (max-width: 1440px) {
    gap: 5px;
    width: 250px;
  }
  @media (max-width: 768px) {
    gap: 5px;
    width: 250px;
  }
`;

export const ProductCardContent = styled.div`
  height: 270px;
  overflow-y: auto;
  overflow: hidden;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
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

export const PrescriptionBadge = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 15px;
  left: 15px;
  right: 0;
  bottom: 0;
  text-align: center;

  width: 115px;
  height: 25px;

  border: 2.5px solid orange;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 650;
`;
