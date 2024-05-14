import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const ProductDetailContainer = styled.div`
  width: 1440px;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  gap: 3rem;
  align-items: flex-start;
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
    width: 100%;
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
  width: 80%;
  text-align: justify;
  h1 {
    font-size: 21px;
    font-weight: 500;
  }
  h3 {
    font-weight: 300;
    font-size: 16;
  }
  div {
    h2 {
      font-size: 18px;
    }
    p {
      padding: 10px 0;
    }
  }
  @media (max-width: 768px) {
    width: 100%;
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
  padding: 5px 20px 5px 0;
  margin: 30px;
  width: 500px;
  height: 600px;
  h2 {
    padding-bottom: 20px;
  }
  @media (max-width: 768px) {
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 600px;
    h2 {
      padding-bottom: 20px;
    }
  }
`;

export const Buttoncontainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
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

  svg {
    stroke: ${COLORS.primary_color};
    width: 30px;
  }
  @media (max-width: 768px) {
    align-items: center;
    justify-content: center;
  }
`;

export const PharmacyItem = styled.div`
  border: 1px solid ${COLORS.primary_color};
  border-radius: 12px;
  padding: 20px;

  &:hover {
    background-color: ${COLORS.input_border};
    color: ${COLORS.primary_text};
    svg {
      color: white;
    }
  }
  @media (max-width: 768px) {
    width: 280px;
  }
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-content: center;
  padding: 0 20px 0 20px;
  padding-bottom: 10x;
  gap: 20px;
  border-bottom: 0px solid white;
  font-size: 16px;

  h2 {
    padding-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 0 10px 10px;
    padding: 10px 0 10px 10px;
    gap: 5px;
    p {
      padding: 10px;
    }
    p {
      padding: 10px;
    }
  }
`;

export const Column = styled.div`
  flex-direction: column;
  padding: 20px;
  border: 1px solid ${COLORS.primary_color};
  border-radius: 12px;
  width: 100%;
  height: 250px;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    gap: 20px;
    svg {
      opacity: 70%;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 5px;
    height: max-content;
  }
`;

export const Distance = styled.div`
  width: 200px;
  padding: 5px;
  align-items: center;
  background-color: #ff6500;
  color: white;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;
