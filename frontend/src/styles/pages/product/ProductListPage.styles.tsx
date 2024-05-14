import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const ProductListContainer = styled.div`
  padding: 2rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;

  @media (max-width: 1440px) {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 3rem 1rem;
    align-items: center;
    align-content: center;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 0.5rem;
  }
`;

export const Content = styled.div`
  max-width: 1440px;
  display: grid;
  grid-template-columns: 1fr 4fr;
  min-height: 85vh;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const CategoryContainer = styled.div`
  border: 1px solid ${COLORS.input_border};
  width: 300px;
  max-height: 700px;
  margin: 2rem 0 auto 0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${COLORS.primary_color};
  overflow: hidden;
  overflow-y: auto;
  ul {
    background-color: transparent;
    li {
      background-color: transparent;
      list-style: none;
      position: relative;
      padding: 10px;
      a {
        color: ${COLORS.primary_color};
        padding: 10px;
        border-radius: 12px;
        text-decoration: none;
      }
    }
    flex-grow: 1;
    overflow-y: auto;
    flex-grow: 1;
    overflow-y: auto;
  }
  @media (max-width: 1440px) {
    margin: 2rem 0 auto 1rem;
    align-items: flex-start;
    overflow-x: auto;
  }
  @media (max-width: 768px) {
    height: 90px;
    align-items: flex-start;
    width: 400px;
    align-content: center;
    ul {
      width: 100%;
    }
  }
`;

export const FilterContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  padding: 0 3rem 3rem;
  justify-content: flex-end;
  font-size: 14px;
  h2 {
    color: ${COLORS.primary_text};
  }
  @media (max-width: 1440px) {
    justify-content: flex-start;
  }
  @media (max-width: 768px) {
    width: 500px;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    padding: 0 3rem;
  }
`;

export const ProductContent = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 2rem 5rem;
  @media (max-width: 1440px) {
    padding: 0;
  }
`;

export const Experience = styled.p`
  font-size: 14px;
  color: ${COLORS.primary_color};
  font-weight: 600;
`;

export const IsOnline = styled.div`
  width: max-content;
  border-radius: 12%;
  background-color: white;
  border: 1px solid green;
  padding: 6px;
  font-size: 12px;
  color: green;
`;

export const IsOffline = styled.div`
  width: max-content;
  border-radius: 12%;
  background-color: white;
  border: 1px solid red;
  padding: 6px;
  font-size: 12px;
  color: red;
`;
