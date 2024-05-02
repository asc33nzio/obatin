import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const ProductListContainer = styled.div`
  padding: 4rem 5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;

  @media (max-width: 1440px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    padding: 3rem 1rem;
    align-items: center;
    align-content: center;
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  min-height: 100vh;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const CategoryContainer = styled.div`
  border: 1px solid ${COLORS.input_border};
  width: 300px;
  height: max-content;
  margin: 2rem 0 auto 5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${COLORS.primary_color};
  overflow: hidden;
  height: 100vh;
  overflow-y: auto;
  overflow: hidden;
  height: 100vh;
  overflow-y: auto;
  @media (max-width: 1440px) {
    margin: 2rem 0 auto 1rem;
    align-items: center;
    align-items: center;
  }
  ul {
    background-color: transparent;
    li {
      background-color: transparent;
      list-style: none;
      position: relative;
      padding: 10px;
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
`;

export const FilterContainer = styled.div`
  width: 100%;
  width: 100%;
  display: flex;
  gap: 20px;
  padding: 2rem 5rem;
  justify-content: flex-end;
  h2 {
    color: ${COLORS.primary_text};
  }
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ProductContent = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
`;
