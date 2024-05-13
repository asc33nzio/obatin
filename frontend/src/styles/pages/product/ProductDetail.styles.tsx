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
    /* border-bottom: 1px solid ${COLORS.primary_text}; */
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
  justify-content: center;
`;

export const Price = styled.p`
  font-size: 24px;
  font-weight: 700;
`;

export const SelectPharmacy = styled.div`
  padding: 5px;
  margin: 30px;
  width: 500px;
  height: 600px;
`;

export const Buttoncontainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const PharmacyNameContainer = styled.div`
  width: max-content;
  height: 50px;
  border-radius: 12px;
  border: 1px solid ${COLORS.primary_color};
  color: ${COLORS.primary_color};
  text-align: center;
  align-items: center;
  padding: 10px;
`;

export const PharmacyCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${COLORS.primary_text};
  background-color: white;

  font-size: 14px;
  font-weight: 600;

  &:hover {
    background-color: white;
    color: ${COLORS.primary_color};
  }
  svg {
    stroke: ${COLORS.primary_color};
    width: 30px;
  }
`;

export const PharmacyItem = styled.div`
  border: 1px solid ${COLORS.primary_color};
  border-radius: 12px;
  &:hover {
    background-color: ${COLORS.primary_color};
    color: white;
  }
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px 0 20px;
  padding-bottom: 0;
  gap: 20px;
  border-bottom: 0px solid white;
  font-size: 16px;
`;

export const Column = styled.div`
  flex-direction: column;
  padding: 20px;
  border: 1px solid ${COLORS.primary_color};
  border-radius: 12px;
  width: 100%;
  height: 200px;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    gap: 20px;
    svg {
      opacity: 70%;
    }
    &:hover {
      color: white;
      svg {
        stroke: white;
      }
    }
  }

  &:hover {
    background-color: ${COLORS.primary_color};
    color: white;
    border: 1px solid white;
    svg {
    }
  }
`;
