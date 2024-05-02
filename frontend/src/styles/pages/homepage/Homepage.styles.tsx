import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const Body = styled.div`
  min-width: 100vh;
  padding: 2rem 5rem;
  align-items: center;
  @media (max-width: 769px) {
    min-width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 769px) {
    min-width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
`;

export const CategoryContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  img {
    margin: 10px;
  }
  @media (max-width: 1440px) {
    width: 100%;
    img {
      margin: 10px 15px;
    }
  }
  @media (max-width: 768px) {
    align-items: center;
    width: 80%;
    img {
      margin: 10px 50px;
    }
  }
`;

export const FiturContainer = styled.div`
  padding: 5rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  @media (max-width: 769px) {
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 769px) {
    display: flex;
    flex-direction: column;
  }
`;

export const Fitur = styled.div`
  padding: 20px;
  width: 400px;
  border: 1px solid ${COLORS.input_border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  justify-content: space-between;
  @media (max-width: 769px) {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
  @media (max-width: 769px) {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
`;

export const Title = styled.h1`
  color: ${COLORS.primary_color};
  font-weight: 700;
`;

export const NewSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  @media (max-width: 769px) {
    padding: 0;
    width: 400px;
  }
  @media (max-width: 769px) {
    padding: 0;
    width: 400px;
  }
`;

export const PopularContainer = styled.div`
  width: 100%;
  padding: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  @media (max-width: 1440px) {
    padding: 1rem 5rem;
  }
  @media (max-width: 768px) {
    align-items: center;
  }
`;

export const Imagecontainer = styled.img`
  width: 150px;
`;

export const ProductCard = styled.div`
  width: 270px;
  height: 330px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${COLORS.input_border};
  border-radius: 12px;
  padding: 20px;
  justify-content: space-between;
`;

export const Bold = styled.p`
  font-weight: 700;
  font-size: 19px;
`;

export const Smallfont = styled.p`
  color: #a5a5a5;
  font-size: 14px;
`;
export const ArrowRight = styled.div`
  color: ${COLORS.primary_color};
`;
