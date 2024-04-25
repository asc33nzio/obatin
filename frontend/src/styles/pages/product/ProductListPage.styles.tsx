import { COLORS } from '@/constants/variables';
import styled from 'styled-components';

export const ProductListContainer = styled.div`
  padding: 2rem 5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  @media (max-width: 1440px) {
    gap: 5px;
    padding: 2rem;
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  min-height: 100vh;
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

  @media (max-width: 1440px) {
    margin: 2rem 0 auto 1rem;
  }
  ul {
    background-color: transparent;
    li {
      background-color: transparent;
      list-style: none;
      position: relative;
      padding: 20px;
      a {
        color: ${COLORS.primary_color};
        padding: 10px;
        border-radius: 12px;
        text-decoration: none;
      }
    }
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 2rem 5rem;
  select {
    color: ${COLORS.primary_color};
    display: inline-block;
    position: relative;
    color: ${COLORS.primary_color};
    border: 1px solid ${COLORS.primary_color};
    padding: 10px;
    border-radius: 12px;
    &:hover + & {
      display: inline-block;
    }
  }
`;

export const ProductContent = styled.div`
  width: 100%;
`;
